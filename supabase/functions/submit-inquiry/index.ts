import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleCorsPreFlight, jsonResponse, errorResponse, ERROR_MESSAGES } from "../_shared/cors.ts";
import { rateLimiters, createRateLimitResponse } from "../_shared/rate-limiter.ts";

interface InquiryInput {
  category: "general" | "payment" | "contract" | "bug" | "other";
  title: string;
  content: string;
  email?: string;
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return handleCorsPreFlight(origin);
  }

  try {
    const { category, title, content, email }: InquiryInput = await req.json();

    // 입력 검증
    if (!category || !title?.trim() || !content?.trim()) {
      return errorResponse("카테고리, 제목, 내용을 모두 입력해주세요.", 400, origin);
    }

    // Rate Limiting (IP 기반)
    const identifier = req.headers.get("x-forwarded-for") || "anonymous";
    const rateLimitResult = rateLimiters.general.check(identifier);
    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult, corsHeaders);
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

    // TODO: 실제 구현 시
    // 1. inquiries 테이블에 저장
    // 2. 이메일 발송 (Resend, SendGrid 등)
    // 3. Slack/Discord 알림

    return jsonResponse({
      success: true,
      message: "문의가 접수되었습니다. 영업일 기준 1-2일 내에 답변드리겠습니다.",
      inquiryId: crypto.randomUUID(),
    }, 200, origin);
  } catch (error) {
    console.error("Submit inquiry error:", error);
    return errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500, origin);
  }
});
