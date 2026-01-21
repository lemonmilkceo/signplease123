import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../../components/ui";
import AllowanceCalculator from "../../components/AllowanceCalculator";

type Step =
  | "business-size"
  | "worker-name"
  | "hourly-wage"
  | "start-date"
  | "work-days"
  | "work-time"
  | "break-time"
  | "work-place"
  | "job-description"
  | "pay-day";

interface ContractData {
  businessSize: "under5" | "over5" | null;
  workerName: string;
  hourlyWage: string;
  startDate: string;
  workDays: string[];
  workStartTime: string;
  workEndTime: string;
  breakTime: string;
  workPlace: string;
  jobDescription: string;
  payDay: string;
}

const STEPS: Step[] = [
  "business-size",
  "worker-name",
  "hourly-wage",
  "start-date",
  "work-days",
  "work-time",
  "break-time",
  "work-place",
  "job-description",
  "pay-day",
];

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

export default function CreateContract() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showCalculator, setShowCalculator] = useState(false);
  const [data, setData] = useState<ContractData>({
    businessSize: null,
    workerName: "",
    hourlyWage: "",
    startDate: "",
    workDays: [],
    workStartTime: "",
    workEndTime: "",
    breakTime: "",
    workPlace: "",
    jobDescription: "",
    payDay: "",
  });

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const canProceed = (): boolean => {
    switch (step) {
      case "business-size":
        return data.businessSize !== null;
      case "worker-name":
        return data.workerName.trim().length > 0;
      case "hourly-wage":
        return data.hourlyWage.length > 0 && parseInt(data.hourlyWage) >= 10360;
      case "start-date":
        return data.startDate.length > 0;
      case "work-days":
        return data.workDays.length > 0;
      case "work-time":
        return data.workStartTime.length > 0 && data.workEndTime.length > 0;
      case "break-time":
        return data.breakTime.length > 0;
      case "work-place":
        return data.workPlace.trim().length > 0;
      case "job-description":
        return data.jobDescription.trim().length > 0;
      case "pay-day":
        return data.payDay.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/employer/preview/new", { state: { contractData: data } });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/employer");
    }
  };

  const toggleDay = (day: string) => {
    setData((prev) => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter((d) => d !== day)
        : [...prev.workDays, day],
    }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 + 진행률 */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10 p-4">
        <div className="max-w-[448px] mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={handleBack}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-body">이전</span>
            </button>
            <span className="text-caption text-muted-foreground">
              {currentStep + 1} / {STEPS.length}
            </span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* 컨텐츠 */}
      <main className="flex-1 mobile-container py-8">
        <div key={step} className="animate-slide-up opacity-0" style={{ animationDelay: "0.05s", animationFillMode: "forwards" }}>
          {/* Step 1: 사업장 규모 */}
          {step === "business-size" && (
            <div>
              <h2 className="text-title text-foreground mb-2">사업장 규모를 선택해주세요</h2>
              <p className="text-body text-muted-foreground mb-6">5인 이상 사업장은 추가 근로 조건이 적용됩니다.</p>
              <div className="space-y-3">
                <button
                  onClick={() => setData({ ...data, businessSize: "under5" })}
                  className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                    data.businessSize === "under5"
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      data.businessSize === "under5" ? "bg-primary/10" : "bg-secondary"
                    }`}>
                      🏠
                    </div>
                    <div className="flex-1">
                      <p className="text-body font-semibold text-foreground">5인 미만</p>
                      <p className="text-caption text-muted-foreground">소규모 사업장</p>
                    </div>
                    {data.businessSize === "under5" && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => setData({ ...data, businessSize: "over5" })}
                  className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                    data.businessSize === "over5"
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      data.businessSize === "over5" ? "bg-primary/10" : "bg-secondary"
                    }`}>
                      🏢
                    </div>
                    <div className="flex-1">
                      <p className="text-body font-semibold text-foreground">5인 이상</p>
                      <p className="text-caption text-muted-foreground">근로기준법 전면 적용</p>
                    </div>
                    {data.businessSize === "over5" && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: 근로자 이름 */}
          {step === "worker-name" && (
            <div>
              <h2 className="text-title text-foreground mb-2">근로자의 성함은 무엇인가요?</h2>
              <p className="text-body text-muted-foreground mb-6">계약서에 기재될 이름입니다.</p>
              <Input
                type="text"
                value={data.workerName}
                onChange={(e) => setData({ ...data, workerName: e.target.value })}
                placeholder="이름 입력"
                autoFocus
              />
            </div>
          )}

          {/* Step 3: 시급 */}
          {step === "hourly-wage" && (
            <div>
              <h2 className="text-title text-foreground mb-2">시급은 얼마로 정하셨나요?</h2>
              <p className="text-body text-muted-foreground mb-6">2026년 최저시급은 10,360원입니다.</p>
              <div className="relative">
                <Input
                  type="number"
                  value={data.hourlyWage}
                  onChange={(e) => setData({ ...data, hourlyWage: e.target.value })}
                  placeholder="10360"
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">원</span>
              </div>
              {data.hourlyWage && parseInt(data.hourlyWage) < 10360 && (
                <p className="text-destructive text-caption mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  최저시급 미만입니다.
                </p>
              )}
              {data.hourlyWage && parseInt(data.hourlyWage) >= 10360 && (
                <div className="mt-4 p-4 bg-success/10 rounded-xl">
                  <p className="text-caption text-success font-medium">
                    예상 월급 (주 40시간 기준): {(parseInt(data.hourlyWage) * 209).toLocaleString()}원
                  </p>
                  <button
                    onClick={() => setShowCalculator(true)}
                    className="mt-2 text-caption text-primary font-medium flex items-center gap-1 hover:underline"
                  >
                    💰 상세 수당 계산기 열기
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 4: 근무 시작일 */}
          {step === "start-date" && (
            <div>
              <h2 className="text-title text-foreground mb-2">근무 시작일은 언제인가요?</h2>
              <p className="text-body text-muted-foreground mb-6">계약 시작일을 선택해주세요.</p>
              <input
                type="date"
                value={data.startDate}
                onChange={(e) => setData({ ...data, startDate: e.target.value })}
                className="w-full px-4 py-4 rounded-xl border border-input bg-background text-foreground text-body focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
          )}

          {/* Step 5: 근무 요일 */}
          {step === "work-days" && (
            <div>
              <h2 className="text-title text-foreground mb-2">근무 요일을 선택해주세요</h2>
              <p className="text-body text-muted-foreground mb-6">여러 개 선택 가능합니다.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`w-12 h-12 rounded-full font-medium transition-all ${
                      data.workDays.includes(day)
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {data.workDays.length > 0 && (
                <p className="text-center text-caption text-muted-foreground mt-4">
                  주 {data.workDays.length}일 근무
                </p>
              )}
            </div>
          )}

          {/* Step 6: 근무 시간 */}
          {step === "work-time" && (
            <div>
              <h2 className="text-title text-foreground mb-2">근무 시간을 알려주세요</h2>
              <p className="text-body text-muted-foreground mb-6">시작 시간과 종료 시간을 입력해주세요.</p>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  value={data.workStartTime}
                  onChange={(e) => setData({ ...data, workStartTime: e.target.value })}
                  className="flex-1 px-4 py-4 rounded-xl border border-input bg-background text-foreground text-body focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <span className="text-muted-foreground">~</span>
                <input
                  type="time"
                  value={data.workEndTime}
                  onChange={(e) => setData({ ...data, workEndTime: e.target.value })}
                  className="flex-1 px-4 py-4 rounded-xl border border-input bg-background text-foreground text-body focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          )}

          {/* Step 7: 휴게 시간 */}
          {step === "break-time" && (
            <div>
              <h2 className="text-title text-foreground mb-2">휴게 시간은 얼마인가요?</h2>
              <p className="text-body text-muted-foreground mb-6">4시간 근무 시 30분, 8시간 근무 시 1시간 이상 필수입니다.</p>
              <div className="grid grid-cols-2 gap-3">
                {["30분", "1시간", "1시간 30분", "2시간"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setData({ ...data, breakTime: option })}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      data.breakTime === option
                        ? "border-primary bg-primary/5 text-primary font-medium"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 8: 근무 장소 */}
          {step === "work-place" && (
            <div>
              <h2 className="text-title text-foreground mb-2">근무 장소는 어디인가요?</h2>
              <p className="text-body text-muted-foreground mb-6">상호명 또는 주소를 입력해주세요.</p>
              <Input
                type="text"
                value={data.workPlace}
                onChange={(e) => setData({ ...data, workPlace: e.target.value })}
                placeholder="예: 스타벅스 강남점"
                autoFocus
              />
            </div>
          )}

          {/* Step 9: 업무 내용 */}
          {step === "job-description" && (
            <div>
              <h2 className="text-title text-foreground mb-2">어떤 업무를 담당하나요?</h2>
              <p className="text-body text-muted-foreground mb-6">주요 업무 내용을 간단히 적어주세요.</p>
              <textarea
                value={data.jobDescription}
                onChange={(e) => setData({ ...data, jobDescription: e.target.value })}
                placeholder="예: 홀 서빙, 주문 접수, 매장 청소"
                className="w-full px-4 py-4 rounded-xl border border-input bg-background text-foreground text-body focus:outline-none focus:ring-2 focus:ring-ring resize-none min-h-[120px]"
                autoFocus
              />
            </div>
          )}

          {/* Step 10: 급여 지급일 */}
          {step === "pay-day" && (
            <div>
              <h2 className="text-title text-foreground mb-2">급여 지급일은 언제인가요?</h2>
              <p className="text-body text-muted-foreground mb-6">매월 급여를 지급하는 날짜를 선택해주세요.</p>
              <div className="flex flex-wrap gap-2">
                {["1일", "5일", "10일", "15일", "20일", "25일", "말일"].map((day) => (
                  <button
                    key={day}
                    onClick={() => setData({ ...data, payDay: day })}
                    className={`px-5 py-3 rounded-full font-medium transition-all ${
                      data.payDay === day
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    매월 {day}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 하단 버튼 */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-lg border-t border-border p-4 safe-area-pb">
        <div className="max-w-[448px] mx-auto">
          <Button
            variant="primary"
            fullWidth
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentStep === STEPS.length - 1 ? "계약서 생성하기" : "다음"}
          </Button>
        </div>
      </div>

      {/* 수당 계산기 모달 */}
      <AllowanceCalculator
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
        initialHourlyWage={parseInt(data.hourlyWage) || 10360}
        initialWorkDays={data.workDays.length > 0 ? data.workDays : ["월", "화", "수", "목", "금"]}
        initialWorkStartTime={data.workStartTime || "09:00"}
        initialWorkEndTime={data.workEndTime || "18:00"}
      />
    </div>
  );
}
