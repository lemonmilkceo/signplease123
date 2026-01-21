import { useState, useEffect, useCallback } from "react";
import { supabase, UserCredits, LegalReviewCredits } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export function useCredits() {
  const { user } = useAuth();
  const [contractCredits, setContractCredits] = useState<UserCredits | null>(null);
  const [legalCredits, setLegalCredits] = useState<LegalReviewCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

      // 계약서 크레딧
      const { data: contractData } = await supabase
        .from("user_credits")
        .select("*")
        .eq("user_id", user.id)
        .single();

      // 법률 검토 크레딧
      const { data: legalData } = await supabase
        .from("legal_review_credits")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setContractCredits(contractData as UserCredits);
      setLegalCredits(legalData as LegalReviewCredits);
    } catch (error) {
      console.error("Error fetching credits:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // 총 계약서 크레딧
  const totalContractCredits = contractCredits
    ? contractCredits.free_credits + contractCredits.paid_credits
    : 0;

  // 총 법률 검토 크레딧
  const totalLegalCredits = legalCredits
    ? legalCredits.free_reviews + legalCredits.paid_reviews
    : 0;

  // 계약서 크레딧 사용
  const useContractCredit = async () => {
    if (!user || totalContractCredits <= 0) {
      return { success: false, error: new Error("No credits available") };
    }

    try {
      // 무료 크레딧 먼저 사용
      const updates: Partial<UserCredits> = {
        total_used: (contractCredits?.total_used || 0) + 1,
      };

      if (contractCredits && contractCredits.free_credits > 0) {
        updates.free_credits = contractCredits.free_credits - 1;
      } else if (contractCredits && contractCredits.paid_credits > 0) {
        updates.paid_credits = contractCredits.paid_credits - 1;
      }

      const { error } = await supabase
        .from("user_credits")
        .update(updates)
        .eq("user_id", user.id);

      if (error) {
        return { success: false, error: new Error(error.message) };
      }

      await fetchCredits();
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  };

  // 법률 검토 크레딧 사용
  const useLegalCredit = async () => {
    if (!user || totalLegalCredits <= 0) {
      return { success: false, error: new Error("No credits available") };
    }

    try {
      const updates: Partial<LegalReviewCredits> = {
        total_used: (legalCredits?.total_used || 0) + 1,
      };

      if (legalCredits && legalCredits.free_reviews > 0) {
        updates.free_reviews = legalCredits.free_reviews - 1;
      } else if (legalCredits && legalCredits.paid_reviews > 0) {
        updates.paid_reviews = legalCredits.paid_reviews - 1;
      }

      const { error } = await supabase
        .from("legal_review_credits")
        .update(updates)
        .eq("user_id", user.id);

      if (error) {
        return { success: false, error: new Error(error.message) };
      }

      await fetchCredits();
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  };

  // 크레딧 충전 (실제 결제 연동 전 mock)
  const addCredits = async (type: "contract" | "legal", amount: number) => {
    if (!user) {
      return { success: false, error: new Error("Not authenticated") };
    }

    try {
      if (type === "contract") {
        const { error } = await supabase
          .from("user_credits")
          .update({
            paid_credits: (contractCredits?.paid_credits || 0) + amount,
          })
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("legal_review_credits")
          .update({
            paid_reviews: (legalCredits?.paid_reviews || 0) + amount,
          })
          .eq("user_id", user.id);

        if (error) throw error;
      }

      await fetchCredits();
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  };

  return {
    contractCredits,
    legalCredits,
    totalContractCredits,
    totalLegalCredits,
    isLoading,
    fetchCredits,
    useContractCredit,
    useLegalCredit,
    addCredits,
  };
}
