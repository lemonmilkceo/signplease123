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
