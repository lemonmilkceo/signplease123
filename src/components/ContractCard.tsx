import { memo } from "react";
import { Link } from "react-router-dom";
import { Contract } from "../lib/supabase";
import { formatDate } from "../utils";

interface ContractCardProps {
  contract: Contract;
  /** 사용자 역할에 따라 다른 링크 경로 */
  role: "employer" | "worker";
  /** 카드 클릭 시 추가 동작 */
  onClick?: () => void;
}

/**
 * 계약서 목록 카드 컴포넌트
 * employer/worker 대시보드에서 공통으로 사용
 * React.memo로 불필요한 리렌더링 방지
 */
function ContractCardComponent({ contract, role, onClick }: ContractCardProps) {
  const linkPath = role === "employer" 
    ? `/employer/contract/${contract.id}` 
    : `/worker/contract/${contract.id}`;

  const icon = role === "employer" ? "👷" : "👔";
  const subtitle = role === "employer" ? contract.work_place : "사장님";

  const statusConfig = {
    draft: { 
      label: "작성 중", 
      className: "bg-secondary text-muted-foreground" 
    },
    pending: { 
      label: "서명 대기", 
      className: "bg-warning/10 text-warning" 
    },
    completed: { 
      label: "완료", 
      className: "bg-success/10 text-success" 
    },
    cancelled: { 
      label: "취소됨", 
      className: "bg-destructive/10 text-destructive" 
    },
  };

  const status = statusConfig[contract.status] || statusConfig.draft;

  return (
    <Link
      to={linkPath}
      onClick={onClick}
      className="block p-4 bg-card border border-border rounded-2xl hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.98]"
      aria-label={`${contract.worker_name} 계약서, 시급 ${contract.hourly_wage.toLocaleString()}원, 상태: ${status.label}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${role === "employer" ? "bg-primary/10" : "bg-warning/10"} rounded-xl flex items-center justify-center`}>
            <span className="text-xl" aria-hidden="true">{icon}</span>
          </div>
          <div>
            <p className="text-body font-semibold text-foreground">
              {role === "employer" ? contract.worker_name : contract.work_place}
            </p>
            <p className="text-caption text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-lg text-caption font-medium ${status.className}`}>
          {status.label}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-caption">
        <span className="text-primary font-medium">
          시급 {contract.hourly_wage.toLocaleString()}원
        </span>
        <span className="text-muted-foreground">
          {formatDate(contract.created_at)}
        </span>
      </div>

      {/* Worker 전용: 서명 대기 상태일 때 CTA 표시 */}
      {role === "worker" && (contract.status === "pending" || contract.status === "draft") && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-caption font-medium">계약 내용 확인하기</span>
          </div>
        </div>
      )}
    </Link>
  );
}

// React.memo로 감싸서 props가 변경되지 않으면 리렌더링 방지
const ContractCard = memo(ContractCardComponent, (prevProps, nextProps) => {
  // contract.id, contract.status, contract.updated_at이 같으면 리렌더링 하지 않음
  return (
    prevProps.contract.id === nextProps.contract.id &&
    prevProps.contract.status === nextProps.contract.status &&
    prevProps.contract.updated_at === nextProps.contract.updated_at &&
    prevProps.role === nextProps.role
  );
});

ContractCard.displayName = "ContractCard";

export default ContractCard;
