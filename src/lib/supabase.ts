import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

// Edge Functions 호출 헬퍼
export async function callEdgeFunction<T>(
  functionName: string,
  body?: Record<string, unknown>
): Promise<T> {
  const { data, error } = await supabase.functions.invoke(functionName, {
    body,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data as T;
}

// 타입 정의
export interface Profile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: "employer" | "worker" | null;
  bank_name: string | null;
  account_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: string;
  employer_id: string;
  worker_id: string | null;
  worker_name: string;
  worker_phone: string | null;
  business_size: "under5" | "over5";
  work_place: string;
  job_description: string | null;
  hourly_wage: number;
  start_date: string;
  end_date: string | null;
  work_days: string[];
  work_start_time: string;
  work_end_time: string;
  break_time: string | null;
  pay_day: string | null;
  employer_signature: string | null;
  employer_signed_at: string | null;
  worker_signature: string | null;
  worker_signed_at: string | null;
  status: "draft" | "pending" | "completed" | "cancelled";
  folder_id: string | null;
  is_deleted: boolean;
  deleted_at: string | null;
  generated_content: Record<string, unknown> | null;
  legal_review: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface UserCredits {
  id: string;
  user_id: string;
  free_credits: number;
  paid_credits: number;
  total_used: number;
  updated_at: string;
}

export interface LegalReviewCredits {
  id: string;
  user_id: string;
  free_reviews: number;
  paid_reviews: number;
  total_used: number;
  updated_at: string;
}

export interface ChatRoom {
  id: string;
  contract_id: string | null;
  employer_id: string;
  worker_id: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  message_type: "text" | "file" | "contract";
  file_url: string | null;
  file_name: string | null;
  is_read: boolean;
  created_at: string;
}
