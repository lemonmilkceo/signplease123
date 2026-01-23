import { createContext, useContext, useEffect, useReducer, useCallback, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, Profile } from "../lib/supabase";
import { logger } from "../utils";

// ============================================================================
// Types
// ============================================================================

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "AUTH_LOADING" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; session: Session } }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "PROFILE_LOADED"; payload: Profile | null }
  | { type: "PROFILE_UPDATED"; payload: Profile }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_ERROR" };

type SocialProvider = "google" | "kakao";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isGuest: boolean;
  error: string | null;
  supabase: typeof supabase;
  signInWithSocial: (provider: SocialProvider) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

// ============================================================================
// Reducer
// ============================================================================

const initialState: AuthState = {
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_LOADING":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        isLoading: false,
        error: null,
      };

    case "AUTH_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case "AUTH_LOGOUT":
      return {
        ...initialState,
        isLoading: false,
      };

    case "PROFILE_LOADED":
      return {
        ...state,
        profile: action.payload,
        isLoading: false,
      };

    case "PROFILE_UPDATED":
      return {
        ...state,
        profile: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 프로필 가져오기 (재시도 로직 포함)
  const fetchProfile = useCallback(async (userId: string, retries = 3): Promise<Profile | null> => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          logger.warn(`Fetch profile attempt ${attempt + 1} failed:`, error.message);
          
          // RLS 에러 또는 프로필이 아직 생성되지 않은 경우 재시도
          if (attempt < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
            continue;
          }
          
          logger.error("Error fetching profile after retries:", error);
          return null;
        }

        return data as Profile;
      } catch (error) {
        logger.error("Error fetching profile:", error);
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
          continue;
        }
        return null;
      }
    }
    return null;
  }, []);

  // 초기 세션 확인
  useEffect(() => {
    let isMounted = true; // 언마운트 시 상태 업데이트 방지
    
    const initAuth = async () => {
      try {
        dispatch({ type: "AUTH_LOADING" });

        const { data: { session }, error } = await supabase.auth.getSession();
        
        // AbortError 무시 (React Strict Mode에서 발생)
        if (error && error.name === "AbortError") {
          logger.debug("Auth init aborted (Strict Mode)");
          return;
        }

        if (!isMounted) return;

        if (session?.user) {
          dispatch({
            type: "AUTH_SUCCESS",
            payload: { user: session.user, session },
          });

          const profile = await fetchProfile(session.user.id);
          if (isMounted) {
            dispatch({ type: "PROFILE_LOADED", payload: profile });
          }
        } else {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } catch (error) {
        // AbortError는 무시 (React Strict Mode에서 정상 동작)
        if (error instanceof Error && error.name === "AbortError") {
          logger.debug("Auth init aborted (Strict Mode)");
          return;
        }
        
        logger.error("Error initializing auth:", error);
        if (isMounted) {
          dispatch({
            type: "AUTH_ERROR",
            payload: "인증 초기화에 실패했습니다",
          });
        }
      }
    };

    initAuth();

    // Auth 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        logger.info("Auth state changed:", event);

        if (session?.user) {
          dispatch({
            type: "AUTH_SUCCESS",
            payload: { user: session.user, session },
          });

          const profile = await fetchProfile(session.user.id);
          if (isMounted) {
            dispatch({ type: "PROFILE_LOADED", payload: profile });
          }
        } else {
          dispatch({ type: "AUTH_LOGOUT" });
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // 소셜 로그인 (Google/Kakao)
  const signInWithSocial = useCallback(async (
    provider: SocialProvider
  ): Promise<{ error: Error | null }> => {
    try {
      dispatch({ type: "AUTH_LOADING" });

      // 배포 환경에서는 Vercel URL 사용, 개발 환경에서는 localhost 사용
      const redirectUrl = import.meta.env.PROD
        ? `${window.location.origin}/select-role`
        : `${window.location.origin}/select-role`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: provider === "kakao" ? {
            // 카카오 로그인 시 필요한 추가 파라미터
            prompt: "login",
          } : undefined,
        },
      });

      if (error) {
        dispatch({ type: "AUTH_ERROR", payload: error.message });
        return { error: new Error(error.message) };
      }

      // OAuth는 리다이렉트되므로 여기서는 에러가 없으면 성공
      return { error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "로그인 실패";
      dispatch({ type: "AUTH_ERROR", payload: errorMessage });
      return { error: error as Error };
    }
  }, []);

  // 로그아웃
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    dispatch({ type: "AUTH_LOGOUT" });
  }, []);

  // 프로필 업데이트
  const updateProfile = useCallback(async (
    updates: Partial<Profile>
  ): Promise<{ error: Error | null }> => {
    if (!state.user) {
      return { error: new Error("Not authenticated") };
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", state.user.id);

      if (error) {
        return { error: new Error(error.message) };
      }

      // 프로필 새로고침
      const updatedProfile = await fetchProfile(state.user.id);
      if (updatedProfile) {
        dispatch({ type: "PROFILE_UPDATED", payload: updatedProfile });
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, [state.user, fetchProfile]);

  // 프로필 새로고침
  const refreshProfile = useCallback(async () => {
    if (state.user) {
      const profile = await fetchProfile(state.user.id);
      dispatch({ type: "PROFILE_LOADED", payload: profile });
    }
  }, [state.user, fetchProfile]);

  // 에러 클리어
  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  // 게스트 모드 여부 (로그인하지 않은 상태)
  const isGuest = !state.user && !state.isLoading;

  const value: AuthContextType = {
    user: state.user,
    session: state.session,
    profile: state.profile,
    isLoading: state.isLoading,
    isGuest,
    error: state.error,
    supabase,
    signInWithSocial,
    signOut,
    updateProfile,
    refreshProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// 인증 상태만 필요한 경우 사용 (불필요한 리렌더링 방지용)
export function useAuthState() {
  const { user, session, profile, isLoading, isGuest, error } = useAuth();
  return { user, session, profile, isLoading, isGuest, error };
}

// 인증 액션만 필요한 경우 사용
export function useAuthActions() {
  const { signInWithSocial, signOut, updateProfile, refreshProfile, clearError } = useAuth();
  return { signInWithSocial, signOut, updateProfile, refreshProfile, clearError };
}
