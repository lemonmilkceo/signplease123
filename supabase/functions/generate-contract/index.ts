import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
  // CORS preflight
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

    // 크레딧 확인
    const { data: credits, error: creditsError } = await supabaseClient
      .from("user_credits")
      .select("free_credits, paid_credits")
      .eq("user_id", user.id)
      .single();

    if (creditsError || !credits) {
      return new Response(JSON.stringify({ error: "Failed to check credits" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const totalCredits = (credits.free_credits || 0) + (credits.paid_credits || 0);
    if (totalCredits < 1) {
      return new Response(JSON.stringify({ error: "Insufficient credits" }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 요청 데이터 파싱
    const input: ContractInput = await req.json();

    // OpenAI API 호출하여 계약서 생성
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

    const aiResult = await openaiResponse.json();
    const generatedContent = aiResult.choices?.[0]?.message?.content || "";

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
      return new Response(JSON.stringify({ error: "Failed to save contract" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 크레딧 차감
    const updateField = credits.free_credits > 0 ? "free_credits" : "paid_credits";
    await supabaseClient
      .from("user_credits")
      .update({
        [updateField]: credits[updateField] - 1,
        total_used: (credits as any).total_used + 1,
      })
      .eq("user_id", user.id);

    return new Response(JSON.stringify({ contract, generatedContent }), {
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
