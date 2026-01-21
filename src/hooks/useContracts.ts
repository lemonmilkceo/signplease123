import { useState, useEffect, useCallback } from "react";
import { supabase, Contract } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

interface ContractInput {
  workerName: string;
  workerPhone?: string;
  businessSize: "under5" | "over5";
  workPlace: string;
  jobDescription?: string;
  hourlyWage: number;
  startDate: string;
  endDate?: string;
  workDays: string[];
  workStartTime: string;
  workEndTime: string;
  breakTime?: string;
  payDay?: string;
}

export function useContracts() {
  const { user, profile } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 계약서 목록 가져오기
  const fetchContracts = useCallback(async () => {
    if (!user) {
      setContracts([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from("contracts")
        .select("*")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      // 역할에 따라 다른 쿼리
      if (profile?.role === "employer") {
        query = query.eq("employer_id", user.id);
      } else if (profile?.role === "worker") {
        query = query.eq("worker_id", user.id);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      setContracts(data as Contract[]);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching contracts:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user, profile?.role]);

  // 초기 로드
  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  // 계약서 생성
  const createContract = async (input: ContractInput) => {
    if (!user) {
      return { data: null, error: new Error("Not authenticated") };
    }

    try {
      const { data, error } = await supabase
        .from("contracts")
        .insert({
          employer_id: user.id,
          worker_name: input.workerName,
          worker_phone: input.workerPhone,
          business_size: input.businessSize,
          work_place: input.workPlace,
          job_description: input.jobDescription,
          hourly_wage: input.hourlyWage,
          start_date: input.startDate,
          end_date: input.endDate,
          work_days: input.workDays,
          work_start_time: input.workStartTime,
          work_end_time: input.workEndTime,
          break_time: input.breakTime,
          pay_day: input.payDay,
          status: "draft",
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      // 목록 새로고침
      await fetchContracts();

      return { data: data as Contract, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  // 계약서 조회
  const getContract = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data: data as Contract, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  // 계약서 업데이트
  const updateContract = async (id: string, updates: Partial<Contract>) => {
    try {
      const { data, error } = await supabase
        .from("contracts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      // 목록 새로고침
      await fetchContracts();

      return { data: data as Contract, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  // 사업주 서명
  const signAsEmployer = async (id: string, signature: string) => {
    return updateContract(id, {
      employer_signature: signature,
      employer_signed_at: new Date().toISOString(),
      status: "pending",
    });
  };

  // 근로자 서명
  const signAsWorker = async (id: string, signature: string) => {
    const contract = contracts.find((c) => c.id === id);
    const newStatus = contract?.employer_signature ? "completed" : "pending";

    return updateContract(id, {
      worker_signature: signature,
      worker_signed_at: new Date().toISOString(),
      status: newStatus,
    });
  };

  // 계약서 삭제 (soft delete)
  const deleteContract = async (id: string) => {
    return updateContract(id, {
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    });
  };

  // 계약서 복원
  const restoreContract = async (id: string) => {
    return updateContract(id, {
      is_deleted: false,
      deleted_at: null,
    });
  };

  // 상태별 필터링
  const pendingContracts = contracts.filter((c) => c.status === "pending" || c.status === "draft");
  const completedContracts = contracts.filter((c) => c.status === "completed");

  return {
    contracts,
    pendingContracts,
    completedContracts,
    isLoading,
    error,
    fetchContracts,
    createContract,
    getContract,
    updateContract,
    signAsEmployer,
    signAsWorker,
    deleteContract,
    restoreContract,
  };
}
