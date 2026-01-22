import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleCorsPreFlight, jsonResponse, errorResponse, ERROR_MESSAGES } from "../_shared/cors.ts";
import { rateLimiters, createRateLimitResponse } from "../_shared/rate-limiter.ts";

interface LegalReviewInput {
  contractId: string;
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

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

    // Rate Limiting
    const rateLimitResult = rateLimiters.ai.check(user.id);
    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult, corsHeaders);
    }

    // 법률 검토 크레딧 확인
    const { data: credits, error: creditsError } = await supabaseClient
      .from("legal_review_credits")
      .select("free_reviews, paid_reviews, total_used")
      .eq("user_id", user.id)
      .single();

    if (creditsError || !credits) {
      console.error("Credits check error:", creditsError);
      return errorResponse("크레딧 확인에 실패했습니다.", 500, origin);
    }

    const totalReviews = (credits.free_reviews || 0) + (credits.paid_reviews || 0);
    if (totalReviews < 1) {
      return errorResponse(ERROR_MESSAGES.INSUFFICIENT_CREDITS, 402, origin);
    }

    // 요청 데이터 파싱
    const { contractId }: LegalReviewInput = await req.json();

    if (!contractId) {
      return errorResponse("계약서 ID가 필요합니다.", 400, origin);
    }

    // 계약서 조회
    const { data: contract, error: contractError } = await supabaseClient
      .from("contracts")
      .select("*")
      .eq("id", contractId)
      .single();

    if (contractError || !contract) {
      return errorResponse(ERROR_MESSAGES.NOT_FOUND, 404, origin);
    }

    // 권한 확인
    if (contract.employer_id !== user.id && contract.worker_id !== user.id) {
      return errorResponse(ERROR_MESSAGES.FORBIDDEN, 403, origin);
    }

    // OpenAI API Key 확인
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      console.error("OPENAI_API_KEY is not configured");
      return errorResponse("AI 서비스가 구성되지 않았습니다.", 500, origin);
    }

    // OpenAI API 호출하여 법률 검토
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
            content: `당신은 한국 노동법 전문 변호사입니다. 근로계약서를 검토하고 다음을 분석해주세요:
            1. 근로기준법 위반 여부
            2. 불리한 조항 경고
            3. 수정 제안
            4. 전체 평가 점수 (1-100)
            JSON 형식으로 응답하세요.`,
          },
          {
            role: "user",
            content: `다음 근로계약서를 법적으로 검토해주세요:
            - 사업장 규모: ${contract.business_size === "over5" ? "5인 이상" : "5인 미만"}
            - 시급: ${contract.hourly_wage}원
            - 근무 시간: ${contract.work_start_time} ~ ${contract.work_end_time}
            - 휴게 시간: ${contract.break_time}
            - 근무 요일: ${contract.work_days?.join(", ")}
            - 업무 내용: ${contract.job_description}
            - 급여 지급일: ${contract.pay_day}`,
          },
        ],
        temperature: 0.2,
      }),
    });

    // OpenAI API 에러 핸들링
    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({}));
      console.error("OpenAI API Error:", openaiResponse.status, errorData);
      
      if (openaiResponse.status === 429) {
        return errorResponse(ERROR_MESSAGES.AI_RATE_LIMITED, 503, origin);
      }
      
      return errorResponse(ERROR_MESSAGES.AI_ERROR, 500, origin);
    }

    const aiResult = await openaiResponse.json();
    const legalReview = aiResult.choices?.[0]?.message?.content;
    
    if (!legalReview) {
      console.error("Empty response from OpenAI:", aiResult);
      return errorResponse("법률 검토 생성에 실패했습니다.", 500, origin);
    }

    // 계약서에 법률 검토 결과 저장
    const { error: updateError } = await supabaseClient
      .from("contracts")
      .update({ legal_review: { raw: legalReview, reviewed_at: new Date().toISOString() } })
      .eq("id", contractId);

    if (updateError) {
      console.error("Legal review save error:", updateError);
    }

    // 크레딧 차감
    const updateField = credits.free_reviews > 0 ? "free_reviews" : "paid_reviews";
    const currentValue = updateField === "free_reviews" ? credits.free_reviews : credits.paid_reviews;
    
    const { error: creditUpdateError } = await supabaseClient
      .from("legal_review_credits")
      .update({
        [updateField]: currentValue - 1,
        total_used: (credits.total_used || 0) + 1,
      })
      .eq("user_id", user.id);

    if (creditUpdateError) {
      console.error("Credit update error:", creditUpdateError);
    }

    return jsonResponse({ legalReview }, 200, origin);
  } catch (error) {
    console.error("Unexpected error:", error);
    return errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500, origin);
  }
});
