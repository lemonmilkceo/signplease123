import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatTime,
  formatTimeAgo,
  formatCurrency,
  formatPhoneNumber,
  isValidEmail,
  isValidPhone,
  isValidPassword,
  calculateWorkHours,
  calculateMonthlySalary,
  truncate,
  capitalize,
  groupBy,
  cn,
} from "./index";

describe("Date Formatting", () => {
  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2026-01-22");
      const result = formatDate(date);
      expect(result).toContain("2026");
      expect(result).toContain("1");
      expect(result).toContain("22");
    });

    it("should handle string input", () => {
      const result = formatDate("2026-01-22");
      expect(result).toContain("2026");
    });
  });

  describe("formatTime", () => {
    it("should format time correctly", () => {
      const date = new Date("2026-01-22T14:30:00");
      const result = formatTime(date);
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe("formatTimeAgo", () => {
    it("should return '방금 전' for recent times", () => {
      const now = new Date();
      const result = formatTimeAgo(now);
      expect(result).toBe("방금 전");
    });

    it("should return minutes ago", () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const result = formatTimeAgo(fiveMinutesAgo);
      expect(result).toBe("5분 전");
    });

    it("should return hours ago", () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const result = formatTimeAgo(twoHoursAgo);
      expect(result).toBe("2시간 전");
    });

    it("should return days ago", () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const result = formatTimeAgo(threeDaysAgo);
      expect(result).toBe("3일 전");
    });
  });
});

describe("Number Formatting", () => {
  describe("formatCurrency", () => {
    it("should format currency with comma and won", () => {
      expect(formatCurrency(10360)).toBe("10,360원");
      expect(formatCurrency(1000000)).toBe("1,000,000원");
      expect(formatCurrency(0)).toBe("0원");
    });
  });

  describe("formatPhoneNumber", () => {
    it("should format phone number with dashes", () => {
      expect(formatPhoneNumber("01012345678")).toBe("010-1234-5678");
      // 10자리 번호는 중간 4자리로 처리 (010-xxxx-xxx)
      expect(formatPhoneNumber("0101234567")).toBe("010-1234-567");
    });

    it("should handle partial input", () => {
      expect(formatPhoneNumber("010")).toBe("010");
      expect(formatPhoneNumber("0101234")).toBe("010-1234");
    });

    it("should remove non-numeric characters", () => {
      expect(formatPhoneNumber("010-1234-5678")).toBe("010-1234-5678");
    });
  });
});

describe("Validation", () => {
  describe("isValidEmail", () => {
    it("should validate correct emails", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.co.kr")).toBe(true);
    });

    it("should reject invalid emails", () => {
      expect(isValidEmail("invalid")).toBe(false);
      expect(isValidEmail("@domain.com")).toBe(false);
      expect(isValidEmail("test@")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("isValidPhone", () => {
    it("should validate correct phone numbers", () => {
      expect(isValidPhone("01012345678")).toBe(true);
      expect(isValidPhone("010-1234-5678")).toBe(true);
      expect(isValidPhone("01112345678")).toBe(true);
    });

    it("should reject invalid phone numbers", () => {
      expect(isValidPhone("123")).toBe(false);
      expect(isValidPhone("02012345678")).toBe(false);
    });
  });

  describe("isValidPassword", () => {
    it("should validate passwords with 6+ characters", () => {
      expect(isValidPassword("123456")).toBe(true);
      expect(isValidPassword("password")).toBe(true);
    });

    it("should reject short passwords", () => {
      expect(isValidPassword("12345")).toBe(false);
      expect(isValidPassword("")).toBe(false);
    });
  });
});

describe("Work Calculations", () => {
  describe("calculateWorkHours", () => {
    it("should calculate work hours correctly", () => {
      expect(calculateWorkHours("09:00", "18:00", 60)).toBe(8);
      expect(calculateWorkHours("09:00", "13:00", 30)).toBe(3.5);
    });

    it("should handle overnight shifts", () => {
      expect(calculateWorkHours("22:00", "06:00", 60)).toBe(7);
    });

    it("should handle zero break time", () => {
      expect(calculateWorkHours("09:00", "18:00", 0)).toBe(9);
    });
  });

  describe("calculateMonthlySalary", () => {
    it("should calculate monthly salary with weekly holiday pay", () => {
      const result = calculateMonthlySalary(10360, 40);
      expect(result.basePay).toBeGreaterThan(0);
      expect(result.weeklyHolidayPay).toBeGreaterThan(0);
      expect(result.totalPay).toBe(result.basePay + result.weeklyHolidayPay);
    });

    it("should not include weekly holiday pay for under 15 hours", () => {
      const result = calculateMonthlySalary(10360, 10);
      expect(result.weeklyHolidayPay).toBe(0);
    });
  });
});

describe("String Utilities", () => {
  describe("truncate", () => {
    it("should truncate long strings", () => {
      expect(truncate("Hello World", 8)).toBe("Hello...");
      expect(truncate("Short", 10)).toBe("Short");
    });
  });

  describe("capitalize", () => {
    it("should capitalize first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("HELLO")).toBe("HELLO");
    });
  });
});

describe("Array Utilities", () => {
  describe("groupBy", () => {
    it("should group array by key", () => {
      const data = [
        { status: "pending", name: "A" },
        { status: "completed", name: "B" },
        { status: "pending", name: "C" },
      ];
      const result = groupBy(data, "status");
      expect(result.pending).toHaveLength(2);
      expect(result.completed).toHaveLength(1);
    });
  });
});

describe("Class Name Utilities", () => {
  describe("cn", () => {
    it("should join class names", () => {
      expect(cn("a", "b", "c")).toBe("a b c");
    });

    it("should filter falsy values", () => {
      expect(cn("a", false, "b", null, undefined, "c")).toBe("a b c");
    });

    it("should handle empty input", () => {
      expect(cn()).toBe("");
    });
  });
});
