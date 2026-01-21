import { useState, useMemo } from "react";
import { Button } from "./ui";

interface CalculatorResult {
  basePay: number;          // 기본급
  weeklyHolidayPay: number; // 주휴수당
  overtimePay: number;      // 연장근로수당
  nightPay: number;         // 야간근로수당
  totalPay: number;         // 총 예상 급여
}

interface AllowanceCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  initialHourlyWage?: number;
  initialWorkDays?: string[];
  initialWorkStartTime?: string;
  initialWorkEndTime?: string;
}

const DAYS_OF_WEEK = ["월", "화", "수", "목", "금", "토", "일"];
const MINIMUM_WAGE_2026 = 10360;

export default function AllowanceCalculator({
  isOpen,
  onClose,
  initialHourlyWage = MINIMUM_WAGE_2026,
  initialWorkDays = ["월", "화", "수", "목", "금"],
  initialWorkStartTime = "09:00",
  initialWorkEndTime = "18:00",
}: AllowanceCalculatorProps) {
  const [hourlyWage, setHourlyWage] = useState(initialHourlyWage);
  const [workDays, setWorkDays] = useState<string[]>(initialWorkDays);
  const [workStartTime, setWorkStartTime] = useState(initialWorkStartTime);
  const [workEndTime, setWorkEndTime] = useState(initialWorkEndTime);
  const [breakMinutes, setBreakMinutes] = useState(60); // 휴게시간 (분)

  // 근무시간 계산
  const calculateWorkHours = (start: string, end: string, breakMins: number): number => {
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    
    let startMinutes = startH * 60 + startM;
    let endMinutes = endH * 60 + endM;
    
    // 야간근무 (익일까지)
    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60;
    }
    
    const totalMinutes = endMinutes - startMinutes - breakMins;
    return Math.max(0, totalMinutes / 60);
  };

  // 야간근무시간 계산 (22:00 ~ 06:00)
  const calculateNightHours = (start: string, end: string): number => {
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    
    let nightHours = 0;
    const startMinutes = startH * 60 + startM;
    let endMinutes = endH * 60 + endM;
    
    if (endMinutes <= startMinutes) {
      endMinutes += 24 * 60;
    }
    
    // 22:00 = 1320분, 06:00 = 360분 (다음날 = 1800분)
    const nightStart1 = 22 * 60; // 22:00
    const nightEnd1 = 24 * 60;   // 24:00
    const nightEnd2 = 6 * 60;    // 06:00
    
    // 22:00 ~ 24:00 구간
    if (startMinutes < nightEnd1 && endMinutes > nightStart1) {
      const overlapStart = Math.max(startMinutes, nightStart1);
      const overlapEnd = Math.min(endMinutes, nightEnd1);
      if (overlapEnd > overlapStart) {
        nightHours += (overlapEnd - overlapStart) / 60;
      }
    }
    
    // 00:00 ~ 06:00 구간 (다음날)
    if (endMinutes > 24 * 60) {
      const adjustedEnd = endMinutes - 24 * 60;
      if (adjustedEnd > 0) {
        nightHours += Math.min(adjustedEnd, nightEnd2) / 60;
      }
    }
    
    return nightHours;
  };

  // 급여 계산
  const result = useMemo<CalculatorResult>(() => {
    const dailyHours = calculateWorkHours(workStartTime, workEndTime, breakMinutes);
    const weeklyHours = dailyHours * workDays.length;
    const monthlyWorkDays = workDays.length * 4.345; // 평균 주 수
    const monthlyHours = dailyHours * monthlyWorkDays;
    
    // 기본급
    const basePay = Math.round(hourlyWage * monthlyHours);
    
    // 주휴수당 (주 15시간 이상 근무 시)
    let weeklyHolidayPay = 0;
    if (weeklyHours >= 15) {
      // 주휴수당 = (1주 소정근로시간 / 40) × 8 × 시급 × 4.345주
      const weeklyHolidayHours = (weeklyHours / 40) * 8;
      weeklyHolidayPay = Math.round(hourlyWage * weeklyHolidayHours * 4.345);
    }
    
    // 연장근로수당 (1일 8시간 또는 주 40시간 초과 시 50% 가산)
    let overtimePay = 0;
    if (dailyHours > 8) {
      const dailyOvertime = dailyHours - 8;
      const monthlyOvertime = dailyOvertime * monthlyWorkDays;
      overtimePay = Math.round(hourlyWage * 0.5 * monthlyOvertime);
    }
    
    // 야간근로수당 (22:00 ~ 06:00 근무 시 50% 가산)
    const nightHours = calculateNightHours(workStartTime, workEndTime);
    const monthlyNightHours = nightHours * monthlyWorkDays;
    const nightPay = Math.round(hourlyWage * 0.5 * monthlyNightHours);
    
    const totalPay = basePay + weeklyHolidayPay + overtimePay + nightPay;
    
    return {
      basePay,
      weeklyHolidayPay,
      overtimePay,
      nightPay,
      totalPay,
    };
  }, [hourlyWage, workDays, workStartTime, workEndTime, breakMinutes]);

  const toggleWorkDay = (day: string) => {
    setWorkDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-background w-full max-w-[448px] rounded-t-3xl animate-slide-up max-h-[90vh] overflow-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-background p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-heading font-semibold text-foreground">💰 수당 계산기</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 시급 입력 */}
          <div className="space-y-2">
            <label className="text-body font-medium text-foreground">시급</label>
            <div className="relative">
              <input
                type="number"
                value={hourlyWage}
                onChange={(e) => setHourlyWage(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-4 py-3 bg-secondary border-0 rounded-xl text-body text-foreground text-right pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">원</span>
            </div>
            <p className="text-caption text-muted-foreground">
              2026년 최저시급: {MINIMUM_WAGE_2026.toLocaleString()}원
            </p>
          </div>

          {/* 근무 요일 */}
          <div className="space-y-2">
            <label className="text-body font-medium text-foreground">근무 요일</label>
            <div className="flex gap-2 flex-wrap">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleWorkDay(day)}
                  className={`w-10 h-10 rounded-full text-caption font-medium transition-all ${
                    workDays.includes(day)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* 근무 시간 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-body font-medium text-foreground">시작 시간</label>
              <input
                type="time"
                value={workStartTime}
                onChange={(e) => setWorkStartTime(e.target.value)}
                className="w-full px-4 py-3 bg-secondary border-0 rounded-xl text-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-body font-medium text-foreground">종료 시간</label>
              <input
                type="time"
                value={workEndTime}
                onChange={(e) => setWorkEndTime(e.target.value)}
                className="w-full px-4 py-3 bg-secondary border-0 rounded-xl text-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* 휴게 시간 */}
          <div className="space-y-2">
            <label className="text-body font-medium text-foreground">휴게 시간</label>
            <div className="flex gap-2">
              {[0, 30, 60, 90].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setBreakMinutes(mins)}
                  className={`flex-1 py-2 rounded-xl text-caption font-medium transition-all ${
                    breakMinutes === mins
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {mins === 0 ? "없음" : `${mins}분`}
                </button>
              ))}
            </div>
          </div>

          {/* 계산 결과 */}
          <div className="bg-secondary rounded-2xl p-5 space-y-4">
            <h3 className="text-body font-semibold text-foreground">📊 예상 월급</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-caption text-muted-foreground">기본급</span>
                <span className="text-body text-foreground">{result.basePay.toLocaleString()}원</span>
              </div>
              
              {result.weeklyHolidayPay > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-caption text-muted-foreground flex items-center gap-1">
                    주휴수당
                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">15h+</span>
                  </span>
                  <span className="text-body text-success">+{result.weeklyHolidayPay.toLocaleString()}원</span>
                </div>
              )}
              
              {result.overtimePay > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-caption text-muted-foreground flex items-center gap-1">
                    연장수당
                    <span className="text-xs bg-warning/10 text-warning px-1.5 py-0.5 rounded">+50%</span>
                  </span>
                  <span className="text-body text-success">+{result.overtimePay.toLocaleString()}원</span>
                </div>
              )}
              
              {result.nightPay > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-caption text-muted-foreground flex items-center gap-1">
                    야간수당
                    <span className="text-xs bg-purple-500/10 text-purple-500 px-1.5 py-0.5 rounded">22-06시</span>
                  </span>
                  <span className="text-body text-success">+{result.nightPay.toLocaleString()}원</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center">
                <span className="text-body font-semibold text-foreground">총 예상 급여</span>
                <span className="text-title font-bold text-primary">{result.totalPay.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {/* 안내 문구 */}
          <p className="text-caption text-muted-foreground text-center">
            ※ 실제 급여는 세금, 4대보험 등에 따라 달라질 수 있습니다.
          </p>

          {/* 닫기 버튼 */}
          <Button variant="primary" fullWidth onClick={onClose}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
