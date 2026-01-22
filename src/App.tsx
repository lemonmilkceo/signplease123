import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingState } from "./components/ui/LoadingSpinner";
import { PageErrorBoundary } from "./components/ErrorBoundary";
import { ProtectedRoute, GuestRoute } from "./components/ProtectedRoute";
import OfflineBanner from "./components/OfflineBanner";

// Lazy-loaded pages - 코드 스플리팅으로 초기 번들 크기 감소
const Splash = lazy(() => import("./pages/Splash"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const SelectRole = lazy(() => import("./pages/SelectRole"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Support = lazy(() => import("./pages/Support"));
const Pricing = lazy(() => import("./pages/Pricing"));
const LegalReviewPricing = lazy(() => import("./pages/LegalReviewPricing"));
const BundlePricing = lazy(() => import("./pages/BundlePricing"));
const Profile = lazy(() => import("./pages/Profile"));
const PaymentHistory = lazy(() => import("./pages/PaymentHistory"));

// Employer pages
const EmployerDashboard = lazy(() => import("./pages/employer/Dashboard"));
const CreateContract = lazy(() => import("./pages/employer/CreateContract"));
const ContractPreview = lazy(() => import("./pages/employer/ContractPreview"));
const ContractDetail = lazy(() => import("./pages/employer/ContractDetail"));
const EmployerChat = lazy(() => import("./pages/employer/Chat"));

// Worker pages
const WorkerDashboard = lazy(() => import("./pages/worker/Dashboard"));
const WorkerContractView = lazy(() => import("./pages/worker/ContractView"));
const WorkerCareer = lazy(() => import("./pages/worker/Career"));
const WorkerChat = lazy(() => import("./pages/worker/Chat"));
const WorkerOnboarding = lazy(() => import("./pages/worker/Onboarding"));

/**
 * Suspense wrapper with error boundary
 */
function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PageErrorBoundary>
      <Suspense fallback={<LoadingState message="페이지 로딩 중..." />}>
        {children}
      </Suspense>
    </PageErrorBoundary>
  );
}

function App() {
  return (
    <div className="app">
      {/* 오프라인 배너 */}
      <OfflineBanner />

      {/* Skip Navigation - 접근성 */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        본문으로 건너뛰기
      </a>

      <main id="main-content">
        <Routes>
          {/* Public routes - 누구나 접근 가능 */}
          <Route path="/" element={<SuspenseWrapper><Splash /></SuspenseWrapper>} />
          <Route path="/terms" element={<SuspenseWrapper><Terms /></SuspenseWrapper>} />
          <Route path="/privacy" element={<SuspenseWrapper><Privacy /></SuspenseWrapper>} />
          <Route path="/support" element={<SuspenseWrapper><Support /></SuspenseWrapper>} />

          {/* Guest routes - 비로그인 사용자만 접근 가능 */}
          <Route element={<GuestRoute />}>
            <Route path="/onboarding" element={<SuspenseWrapper><Onboarding /></SuspenseWrapper>} />
            <Route path="/login" element={<SuspenseWrapper><Login /></SuspenseWrapper>} />
            <Route path="/signup" element={<SuspenseWrapper><Signup /></SuspenseWrapper>} />
            <Route path="/forgot-password" element={<SuspenseWrapper><ForgotPassword /></SuspenseWrapper>} />
            <Route path="/reset-password" element={<SuspenseWrapper><ResetPassword /></SuspenseWrapper>} />
          </Route>

          {/* Protected routes - 로그인 필요 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/select-role" element={<SuspenseWrapper><SelectRole /></SuspenseWrapper>} />
            <Route path="/profile" element={<SuspenseWrapper><Profile /></SuspenseWrapper>} />
            <Route path="/pricing" element={<SuspenseWrapper><Pricing /></SuspenseWrapper>} />
            <Route path="/legal-review-pricing" element={<SuspenseWrapper><LegalReviewPricing /></SuspenseWrapper>} />
            <Route path="/bundle-pricing" element={<SuspenseWrapper><BundlePricing /></SuspenseWrapper>} />
            <Route path="/payment-history" element={<SuspenseWrapper><PaymentHistory /></SuspenseWrapper>} />
          </Route>

          {/* Employer routes - 사업주 역할 필요 */}
          <Route element={<ProtectedRoute requiredRole="employer" />}>
            <Route path="/employer" element={<SuspenseWrapper><EmployerDashboard /></SuspenseWrapper>} />
            <Route path="/employer/create" element={<SuspenseWrapper><CreateContract /></SuspenseWrapper>} />
            <Route path="/employer/preview/:id" element={<SuspenseWrapper><ContractPreview /></SuspenseWrapper>} />
            <Route path="/employer/contract/:id" element={<SuspenseWrapper><ContractDetail /></SuspenseWrapper>} />
            <Route path="/employer/chat" element={<SuspenseWrapper><EmployerChat /></SuspenseWrapper>} />
          </Route>

          {/* Worker routes - 근로자 역할 필요 */}
          <Route element={<ProtectedRoute requiredRole="worker" />}>
            <Route path="/worker" element={<SuspenseWrapper><WorkerDashboard /></SuspenseWrapper>} />
            <Route path="/worker/onboarding" element={<SuspenseWrapper><WorkerOnboarding /></SuspenseWrapper>} />
            <Route path="/worker/contract/:id" element={<SuspenseWrapper><WorkerContractView /></SuspenseWrapper>} />
            <Route path="/worker/career" element={<SuspenseWrapper><WorkerCareer /></SuspenseWrapper>} />
            <Route path="/worker/chat" element={<SuspenseWrapper><WorkerChat /></SuspenseWrapper>} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
