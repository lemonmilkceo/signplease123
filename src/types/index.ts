// Re-export types from supabase
export type {
  Profile,
  Contract,
  UserCredits,
  LegalReviewCredits,
  ChatRoom,
  ChatMessage,
} from "../lib/supabase";

// User & Auth Types
export type UserRole = "employer" | "worker";

export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: UserRole | null;
}

// Contract Types
export type ContractStatus = "draft" | "pending" | "completed" | "cancelled";
export type BusinessSize = "under5" | "over5";

export interface ContractInput {
  businessSize: BusinessSize;
  workerName: string;
  workerPhone?: string;
  hourlyWage: number;
  startDate: string;
  endDate?: string;
  workDays: string[];
  workStartTime: string;
  workEndTime: string;
  breakTime: string;
  workPlace: string;
  jobDescription: string;
  payDay: string;
}

// Chat Types
export type MessageType = "text" | "file" | "contract";

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead?: boolean;
  type?: MessageType;
  fileUrl?: string;
  fileName?: string;
}

// Notification Types
export type NotificationType = "contract_signed" | "contract_received" | "message" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

// Payment Types
export type PaymentType = "contract_credit" | "legal_review" | "bundle";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  description: string;
  paymentType: PaymentType;
  creditsAdded?: number;
  reviewsAdded?: number;
  status: PaymentStatus;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: Date;
}

// Legal Review Types
export type IssueSeverity = "error" | "warning" | "info";

export interface LegalReviewIssue {
  severity: IssueSeverity;
  title: string;
  description: string;
  suggestion?: string;
}

export interface LegalReviewResult {
  isValid: boolean;
  issues: LegalReviewIssue[];
  summary: string;
  score?: number;
}

// Sort & Filter Types
export type SortOption = "newest" | "oldest" | "name" | "wage";

export interface FilterOptions {
  status?: ContractStatus;
  searchQuery?: string;
  sortBy?: SortOption;
}

// ============================================================================
// API Response Types
// ============================================================================

/** 공통 API 응답 래퍼 */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

/** API 에러 타입 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/** 페이지네이션 응답 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** Edge Function 응답 타입들 */
export interface GenerateContractResponse {
  content: string;
  creditsRemaining: number;
}

export interface ExplainTermResponse {
  explanation: string;
}

export interface SupportChatResponse {
  reply: string;
}

export interface LegalAdviceResponse {
  advice: string;
  issues: LegalReviewIssue[];
  creditsRemaining: number;
}

// ============================================================================
// Component Props Types (공통)
// ============================================================================

/** 로딩 상태를 가진 컴포넌트 props */
export interface WithLoading {
  isLoading?: boolean;
}

/** 에러 상태를 가진 컴포넌트 props */
export interface WithError {
  error?: string | null;
}

/** 비활성화 가능한 컴포넌트 props */
export interface Disableable {
  disabled?: boolean;
}

/** 자식 요소를 가진 컴포넌트 props */
export interface WithChildren {
  children: React.ReactNode;
}
