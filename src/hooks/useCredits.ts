import { useState, useEffect, useCallback } from "react";
import { supabase, UserCredits, LegalReviewCredits } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { logger } from "../utils";
import { API_ERRORS } from "../utils/errorMessages";

/**
 * 크레딧 관리 훅
 * 
 * 중요: 크레딧 차감은 Edge Function에서 수행됩니다.
 * 이 훅은 주로 크레딧 조회 및 표시 목적으로 사용됩니다.
 * 
 * - 계약서 생성: generate-contract Edge Function에서 차감
 * - 법률 검토: contract-legal-advice Edge Function에서 차감
 */
export function useCredits() {
  const { user } = useAuth();
  const [contractCredits, setContractCredits] = useState<UserCredits | null>(null);
  const [legalCredits, setLegalCredits] = useState<LegalReviewCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 크레딧 정보 가져오기
  const fetchCredits = useCallback(async () => {
    if (!user) {
      setContractCredits(null);
      setLegalCredits(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 병렬로 크레딧 조회
      const [contractResult, legalResult] = await Promise.all([
        supabase
          .from("user_credits")
          .select("*")
          .eq("user_id", user.id)
          .single(),
        supabase
          .from("legal_review_credits")
          .select("*")
          .eq("user_id", user.id)
          .single(),
      ]);

      if (contractResult.error) {
        logger.warn("Failed to fetch contract credits", contractResult.error);
      }
      if (legalResult.error) {
        logger.warn("Failed to fetch legal credits", legalResult.error);
      }

      setContractCredits(contractResult.data as UserCredits);
      setLegalCredits(legalResult.data as LegalReviewCredits);
    } catch (err) {
      logger.error("Error fetching credits", err);
      setError(API_ERRORS.CREDIT_CHECK_FAILED);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // 사용자 변경 시 크레딧 갱신
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // 실시간 크레딧 변경 구독
  useEffect(() => {
    if (!user) return;

    const contractSubscription = supabase
      .channel("user_credits_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_credits",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          logger.debug("Contract credits updated", payload);
          if (payload.new) {
            setContractCredits(payload.new as UserCredits);
          }
        }
      )
      .subscribe();

    const legalSubscription = supabase
      .channel("legal_credits_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "legal_review_credits",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          logger.debug("Legal credits updated", payload);
          if (payload.new) {
            setLegalCredits(payload.new as LegalReviewCredits);
          }
        }
      )
      .subscribe();

    return () => {
      contractSubscription.unsubscribe();
      legalSubscription.unsubscribe();
    };
  }, [user]);

  // 총 계약서 크레딧
  const totalContractCredits = contractCredits
    ? contractCredits.free_credits + contractCredits.paid_credits
    : 0;

  // 총 법률 검토 크레딧
  const totalLegalCredits = legalCredits
    ? legalCredits.free_reviews + legalCredits.paid_reviews
    : 0;

  // 크레딧 충분 여부 확인
  const hasContractCredits = totalContractCredits > 0;
  const hasLegalCredits = totalLegalCredits > 0;

  // 무료 크레딧 남은 수
  const remainingFreeContractCredits = contractCredits?.free_credits || 0;
  const remainingFreeLegalCredits = legalCredits?.free_reviews || 0;

  /**
   * @deprecated 크레딧 차감은 Edge Function에서 수행됩니다.
   * 이 함수는 하위 호환성을 위해 남겨두었습니다.
   */
  const useContractCredit = async () => {
    logger.warn("useContractCredit is deprecated. Credits are deducted by Edge Functions.");
    // Edge Function이 차감을 처리하므로, 여기서는 갱신만 수행
    await fetchCredits();
    return { success: true, error: null };
  };

  /**
   * @deprecated 크레딧 차감은 Edge Function에서 수행됩니다.
   * 이 함수는 하위 호환성을 위해 남겨두었습니다.
   */
  const useLegalCredit = async () => {
    logger.warn("useLegalCredit is deprecated. Credits are deducted by Edge Functions.");
    // Edge Function이 차감을 처리하므로, 여기서는 갱신만 수행
    await fetchCredits();
    return { success: true, error: null };
  };

  /**
   * 크레딧 충전 (결제 후 호출)
   * TODO: 실제 결제 연동 시 Edge Function으로 이동
   */
  const addCredits = async (type: "contract" | "legal", amount: number) => {
    if (!user) {
      return { success: false, error: new Error("Not authenticated") };
    }

    logger.action("add_credits", { type, amount });

    try {
      if (type === "contract") {
        const { error: updateError } = await supabase
          .from("user_credits")
          .update({
            paid_credits: (contractCredits?.paid_credits || 0) + amount,
          })
          .eq("user_id", user.id);

        if (updateError) throw updateError;
      } else {
        const { error: updateError } = await supabase
          .from("legal_review_credits")
          .update({
            paid_reviews: (legalCredits?.paid_reviews || 0) + amount,
          })
          .eq("user_id", user.id);

        if (updateError) throw updateError;
      }

      await fetchCredits();
      logger.action("add_credits_success", { type, amount });
      return { success: true, error: null };
    } catch (err) {
      logger.error("Failed to add credits", err);
      return { success: false, error: err as Error };
    }
  };

  return {
    // 크레딧 데이터
    contractCredits,
    legalCredits,
    
    // 계산된 값
    totalContractCredits,
    totalLegalCredits,
    hasContractCredits,
    hasLegalCredits,
    remainingFreeContractCredits,
    remainingFreeLegalCredits,
    
    // 상태
    isLoading,
    error,
    
    // 액션
    fetchCredits,
    addCredits,
    
    // Deprecated (하위 호환성)
    useContractCredit,
    useLegalCredit,
  };
}
