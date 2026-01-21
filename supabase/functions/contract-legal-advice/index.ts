import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LegalReviewInput {
  contractId: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
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
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 법률 검토 크레딧 확인
    const { data: credits, error: creditsError } = await supabaseClient
      .from("legal_review_credits")
      .select("free_reviews, paid_reviews, total_used")
      .eq("user_id", user.id)
      .single();

    if (creditsError || !credits) {
      return new Response(JSON.stringify({ error: "Failed to check credits" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const totalReviews = (credits.free_reviews || 0) + (credits.paid_reviews || 0);
    if (totalReviews < 1) {
      return new Response(JSON.stringify({ error: "Insufficient legal review credits" }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 요청 데이터 파싱
    const { contractId }: LegalReviewInput = await req.json();

    // 계약서 조회
    const { data: contract, error: contractError } = await supabaseClient
      .from("contracts")
      .select("*")
      .eq("id", contractId)
      .single();

    if (contractError || !contract) {
      return new Response(JSON.stringify({ error: "Contract not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 권한 확인
    if (contract.employer_id !== user.id && contract.worker_id !== user.id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // OpenAI API 호출하여 법률 검토
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
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

    const aiResult = await openaiResponse.json();
    const legalReview = aiResult.choices?.[0]?.message?.content || "";

    // 계약서에 법률 검토 결과 저장
    await supabaseClient
      .from("contracts")
      .update({ legal_review: { raw: legalReview, reviewed_at: new Date().toISOString() } })
      .eq("id", contractId);

    // 크레딧 차감
    const updateField = credits.free_reviews > 0 ? "free_reviews" : "paid_reviews";
    await supabaseClient
      .from("legal_review_credits")
      .update({
        [updateField]: credits[updateField] - 1,
        total_used: credits.total_used + 1,
      })
      .eq("user_id", user.id);

    return new Response(JSON.stringify({ legalReview }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
