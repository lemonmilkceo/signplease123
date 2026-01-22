import { describe, it, expect } from "vitest";
import {
  escapeHtml,
  isSafeUrl,
  sanitizeUrl,
  sanitizeInput,
  maskSensitiveData,
  maskAccountNumber,
  maskPhoneNumber,
  maskEmail,
  isTokenExpired,
} from "./security";

describe("Security Utilities", () => {
  describe("escapeHtml", () => {
    it("should escape HTML special characters", () => {
      expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
      expect(escapeHtml('alert("XSS")')).toBe("alert(&quot;XSS&quot;)");
      expect(escapeHtml("a & b")).toBe("a &amp; b");
    });

    it("should handle empty string", () => {
      expect(escapeHtml("")).toBe("");
    });

    it("should not modify safe strings", () => {
      expect(escapeHtml("Hello World")).toBe("Hello World");
    });
  });

  describe("isSafeUrl", () => {
    it("should accept http/https URLs", () => {
      expect(isSafeUrl("https://example.com")).toBe(true);
      expect(isSafeUrl("http://example.com")).toBe(true);
    });

    it("should accept mailto and tel URLs", () => {
      expect(isSafeUrl("mailto:test@example.com")).toBe(true);
      expect(isSafeUrl("tel:010-1234-5678")).toBe(true);
    });

    it("should reject javascript URLs", () => {
      expect(isSafeUrl("javascript:alert(1)")).toBe(false);
    });

    it("should reject data URLs", () => {
      expect(isSafeUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
    });

    it("should accept relative paths", () => {
      expect(isSafeUrl("/path/to/page")).toBe(true);
      expect(isSafeUrl("./relative")).toBe(true);
    });
  });

  describe("sanitizeUrl", () => {
    it("should return safe URLs unchanged", () => {
      expect(sanitizeUrl("https://example.com")).toBe("https://example.com");
    });

    it("should return empty string for unsafe URLs", () => {
      expect(sanitizeUrl("javascript:alert(1)")).toBe("");
    });
  });

  describe("sanitizeInput", () => {
    it("should remove HTML tags", () => {
      expect(sanitizeInput("<script>alert(1)</script>")).toBe("alert(1)");
      expect(sanitizeInput("Hello <b>World</b>")).toBe("Hello World");
    });

    it("should remove javascript: protocol", () => {
      expect(sanitizeInput("javascript:alert(1)")).toBe("alert(1)");
    });

    it("should remove event handlers", () => {
      expect(sanitizeInput('onerror=alert(1)')).toBe("alert(1)");
      expect(sanitizeInput('onclick = alert(1)')).toBe("alert(1)");
    });

    it("should trim whitespace", () => {
      expect(sanitizeInput("  hello  ")).toBe("hello");
    });
  });

  describe("Masking Functions", () => {
    describe("maskSensitiveData", () => {
      it("should mask middle characters", () => {
        expect(maskSensitiveData("1234567890", 3, 3)).toBe("123****890");
      });

      it("should mask short strings entirely", () => {
        expect(maskSensitiveData("abc", 2, 2)).toBe("***");
      });
    });

    describe("maskAccountNumber", () => {
      it("should mask account number", () => {
        expect(maskAccountNumber("1234567890123")).toBe("1234*****0123");
      });
    });

    describe("maskPhoneNumber", () => {
      it("should mask phone number", () => {
        expect(maskPhoneNumber("01012345678")).toBe("010-****-5678");
      });

      it("should handle formatted phone", () => {
        expect(maskPhoneNumber("010-1234-5678")).toBe("010-****-5678");
      });
    });

    describe("maskEmail", () => {
      it("should mask email", () => {
        expect(maskEmail("test@example.com")).toBe("t**t@example.com");
        expect(maskEmail("ab@example.com")).toBe("**@example.com");
      });

      it("should handle invalid email", () => {
        expect(maskEmail("invalid")).toBe("invalid");
      });
    });
  });

  describe("isTokenExpired", () => {
    it("should return true for expired token", () => {
      // 만료된 토큰 (exp: 과거)
      const expiredPayload = { exp: Math.floor(Date.now() / 1000) - 3600 };
      const expiredToken = `header.${btoa(JSON.stringify(expiredPayload))}.signature`;
      expect(isTokenExpired(expiredToken)).toBe(true);
    });

    it("should return false for valid token", () => {
      // 유효한 토큰 (exp: 미래)
      const validPayload = { exp: Math.floor(Date.now() / 1000) + 3600 };
      const validToken = `header.${btoa(JSON.stringify(validPayload))}.signature`;
      expect(isTokenExpired(validToken)).toBe(false);
    });

    it("should return true for malformed token", () => {
      expect(isTokenExpired("invalid")).toBe(true);
      expect(isTokenExpired("a.b")).toBe(true);
    });
  });
});
