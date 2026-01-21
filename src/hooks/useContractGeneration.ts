import { useState, useCallback } from "react";
import { callEdgeFunction } from "../lib/supabase";
import { Contract } from "../lib/supabase";

interface ContractInput {
  businessSize: "under5" | "over5";
  workerName: string;
  workerPhone?: string;
  hourlyWage: number;
  startDate: string;
  endDate?: string;
  workDays: string[];
  workStartTime: string;
  workEndTime: string;
  breakTime: string;
  workPlace: string;
  jobDescription: string;
  payDay: string;
}

interface GenerateContractResponse {
  contract: Contract;
  generatedContent: string;
}

interface ExplainTermResponse {
  explanation: string;
}

interface LegalReviewResponse {
  review: {
    isValid: boolean;
    issues: Array<{
      severity: "error" | "warning" | "info";
      title: string;
      description: string;
      suggestion?: string;
    }>;
    summary: string;
  };
}

export function useContractGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 계약서 생성
  const generateContract = useCallback(async (input: ContractInput) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await callEdgeFunction<GenerateContractResponse>("generate-contract", {
        ...input,
        hourlyWage: Number(input.hourlyWage),
      });

      return { data: response, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "계약서 생성에 실패했습니다.";
      setError(errorMessage);
      
      // 크레딧 부족 에러 처리
      if (errorMessage.includes("Insufficient credits")) {
        return { data: null, error: "크레딧이 부족합니다. 충전 후 다시 시도해주세요." };
      }
      
      return { data: null, error: errorMessage };
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // 용어 설명
  const explainTerm = useCallback(async (term: string, context?: string) => {
    setIsExplaining(true);
    setError(null);

    try {
      const response = await callEdgeFunction<ExplainTermResponse>("explain-term", {
        term,
        context,
      });

      return { data: response.explanation, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "설명을 가져오는데 실패했습니다.";
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setIsExplaining(false);
    }
  }, []);

  // 법률 검토
  const reviewContract = useCallback(async (contractId: string) => {
    setIsReviewing(true);
    setError(null);

    try {
      const response = await callEdgeFunction<LegalReviewResponse>("contract-legal-advice", {
        contractId,
      });

      return { data: response.review, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "법률 검토에 실패했습니다.";
      setError(errorMessage);
      
      // 크레딧 부족 에러 처리
      if (errorMessage.includes("Insufficient")) {
        return { data: null, error: "법률 검토 크레딧이 부족합니다." };
      }
      
      return { data: null, error: errorMessage };
    } finally {
      setIsReviewing(false);
    }
  }, []);

  return {
    generateContract,
    explainTerm,
    reviewContract,
    isGenerating,
    isExplaining,
    isReviewing,
    error,
  };
}
