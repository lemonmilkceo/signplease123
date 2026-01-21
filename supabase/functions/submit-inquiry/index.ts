import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InquiryInput {
  category: "general" | "payment" | "contract" | "bug" | "other";
  title: string;
  content: string;
  email?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { category, title, content, email }: InquiryInput = await req.json();

    if (!category || !title || !content) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 사용자 정보 (선택적)
    let userId = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const userClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: { user } } = await userClient.auth.getUser();
      userId = user?.id;
    }

    // 문의 저장 (별도 테이블이 있다면)
    // 여기서는 간단히 로그로 처리하고 이메일 발송 시뮬레이션
    console.log("New inquiry:", {
      category,
      title,
      content,
      email,
      userId,
      timestamp: new Date().toISOString(),
    });

    // 실제로는 이메일 발송 또는 Slack 알림 등 연동
    // await sendEmail({ to: "support@signplease.kr", subject: title, body: content });

    return new Response(
      JSON.stringify({
        success: true,
        message: "문의가 접수되었습니다. 영업일 기준 1-2일 내에 답변드리겠습니다.",
        inquiryId: crypto.randomUUID(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
