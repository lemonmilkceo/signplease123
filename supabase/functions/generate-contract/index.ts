import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleCorsPreFlight, jsonResponse, errorResponse, ERROR_MESSAGES } from "../_shared/cors.ts";
import { rateLimiters, createRateLimitResponse } from "../_shared/rate-limiter.ts";

interface ContractInput {
  businessSize: "under5" | "over5";
  workerName: string;
  hourlyWage: number;
  startDate: string;
  workDays: string[];
  workStartTime: string;
  workEndTime: string;
  breakTime: string;
  workPlace: string;
  jobDescription: string;
  payDay: string;
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // CORS preflight
  if (req.method === "OPTIONS") {
    return handleCorsPreFlight(origin);
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: req.headers.get("Authorization")! } },
      }
    );

    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return errorResponse(ERROR_MESSAGES.UNAUTHORIZED, 401, origin);
    }

    // Rate Limiting (AI 호출은 분당 5회 제한)
    const rateLimitResult = rateLimiters.ai.check(user.id);
    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult, corsHeaders);
    }

    // 크레딧 확인 (total_used 포함)
    const { data: credits, error: creditsError } = await supabaseClient
      .from("user_credits")
      .select("free_credits, paid_credits, total_used")
      .eq("user_id", user.id)
      .single();

    if (creditsError || !credits) {
      console.error("Credits check error:", creditsError);
      return errorResponse("크레딧 확인에 실패했습니다.", 500, origin);
    }

    const totalCredits = (credits.free_credits || 0) + (credits.paid_credits || 0);
    if (totalCredits < 1) {
      return errorResponse(ERROR_MESSAGES.INSUFFICIENT_CREDITS, 402, origin);
    }

    // 요청 데이터 파싱
    const input: ContractInput = await req.json();

    // 입력 검증
    if (!input.workerName?.trim()) {
      return errorResponse("근로자명은 필수입니다.", 400, origin);
    }
    if (!input.workPlace?.trim()) {
      return errorResponse("근무 장소는 필수입니다.", 400, origin);
    }
    if (!input.hourlyWage || input.hourlyWage < 0) {
      return errorResponse("올바른 시급을 입력해주세요.", 400, origin);
    }

    // OpenAI API Key 확인
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      console.error("OPENAI_API_KEY is not configured");
      return errorResponse("AI 서비스가 구성되지 않았습니다.", 500, origin);
    }

    // OpenAI API 호출하여 계약서 생성
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `당신은 한국 근로기준법 전문가입니다. 표준근로계약서를 작성해주세요.
            - 최신 근로기준법을 준수해야 합니다
            - 5인 미만/이상 사업장 구분에 따른 조항을 적용하세요
            - 명확하고 이해하기 쉬운 문장을 사용하세요
            - JSON 형식으로 응답하세요`,
          },
          {
            role: "user",
            content: `다음 정보로 표준근로계약서를 작성해주세요:
            - 사업장 규모: ${input.businessSize === "over5" ? "5인 이상" : "5인 미만"}
            - 근로자명: ${input.workerName}
            - 시급: ${input.hourlyWage}원
            - 근무 시작일: ${input.startDate}
            - 근무 요일: ${input.workDays.join(", ")}
            - 근무 시간: ${input.workStartTime} ~ ${input.workEndTime}
            - 휴게 시간: ${input.breakTime}
            - 근무 장소: ${input.workPlace}
            - 업무 내용: ${input.jobDescription}
            - 급여 지급일: 매월 ${input.payDay}`,
          },
        ],
        temperature: 0.3,
      }),
    });

    // OpenAI API 에러 핸들링
    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({}));
      console.error("OpenAI API Error:", openaiResponse.status, errorData);
      
      if (openaiResponse.status === 429) {
        return errorResponse(ERROR_MESSAGES.AI_RATE_LIMITED, 503, origin);
      }
      
      if (openaiResponse.status === 401) {
        return errorResponse("AI 서비스 인증에 실패했습니다.", 500, origin);
      }
      
      return errorResponse(ERROR_MESSAGES.AI_ERROR, 500, origin);
    }

    const aiResult = await openaiResponse.json();
    const generatedContent = aiResult.choices?.[0]?.message?.content;
    
    if (!generatedContent) {
      console.error("Empty response from OpenAI:", aiResult);
      return errorResponse("계약서 생성에 실패했습니다. 다시 시도해주세요.", 500, origin);
    }

    // 계약서 저장
    const { data: contract, error: insertError } = await supabaseClient
      .from("contracts")
      .insert({
        employer_id: user.id,
        worker_name: input.workerName,
        business_size: input.businessSize,
        work_place: input.workPlace,
        job_description: input.jobDescription,
        hourly_wage: input.hourlyWage,
        start_date: input.startDate,
        work_days: input.workDays,
        work_start_time: input.workStartTime,
        work_end_time: input.workEndTime,
        break_time: input.breakTime,
        pay_day: input.payDay,
        generated_content: { raw: generatedContent },
        status: "draft",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Contract save error:", insertError);
      return errorResponse("계약서 저장에 실패했습니다.", 500, origin);
    }

    // 크레딧 차감 (무료 크레딧 먼저 사용)
    const updateField = credits.free_credits > 0 ? "free_credits" : "paid_credits";
    const currentValue = updateField === "free_credits" ? credits.free_credits : credits.paid_credits;
    
    const { error: creditUpdateError } = await supabaseClient
      .from("user_credits")
      .update({
        [updateField]: currentValue - 1,
        total_used: (credits.total_used || 0) + 1,
      })
      .eq("user_id", user.id);

    if (creditUpdateError) {
      console.error("Credit update error:", creditUpdateError);
      // 계약서는 이미 생성되었으므로, 에러 로그만 남기고 성공 응답
    }

    return jsonResponse({ contract, generatedContent }, 200, origin);
  } catch (error) {
    console.error("Unexpected error:", error);
    return errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500, origin);
  }
});
