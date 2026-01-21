import { Route, Routes } from "react-router-dom";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SelectRole from "./pages/SelectRole";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Support from "./pages/Support";
import EmployerDashboard from "./pages/employer/Dashboard";
import CreateContract from "./pages/employer/CreateContract";
import ContractPreview from "./pages/employer/ContractPreview";
import ContractDetail from "./pages/employer/ContractDetail";
import EmployerChat from "./pages/employer/Chat";
import WorkerDashboard from "./pages/worker/Dashboard";
import WorkerContractView from "./pages/worker/ContractView";
import WorkerCareer from "./pages/worker/Career";
import WorkerChat from "./pages/worker/Chat";
import WorkerOnboarding from "./pages/worker/Onboarding";
import Pricing from "./pages/Pricing";
import LegalReviewPricing from "./pages/LegalReviewPricing";
import BundlePricing from "./pages/BundlePricing";
import Profile from "./pages/Profile";
import PaymentHistory from "./pages/PaymentHistory";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/support" element={<Support />} />
        <Route path="/employer" element={<EmployerDashboard />} />
        <Route path="/employer/create" element={<CreateContract />} />
        <Route path="/employer/preview/:id" element={<ContractPreview />} />
        <Route path="/employer/contract/:id" element={<ContractDetail />} />
        <Route path="/employer/chat" element={<EmployerChat />} />
        <Route path="/worker" element={<WorkerDashboard />} />
        <Route path="/worker/onboarding" element={<WorkerOnboarding />} />
        <Route path="/worker/contract/:id" element={<WorkerContractView />} />
        <Route path="/worker/career" element={<WorkerCareer />} />
        <Route path="/worker/chat" element={<WorkerChat />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/legal-review-pricing" element={<LegalReviewPricing />} />
        <Route path="/bundle-pricing" element={<BundlePricing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
      </Routes>
    </div>
  );
}

export default App;
