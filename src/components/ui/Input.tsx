import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 입력 필드 라벨 */
  label?: string;
  /** 에러 메시지 (표시 시 빨간색 테두리 및 메시지) */
  error?: string;
}

/**
 * 재사용 가능한 입력 필드 컴포넌트
 * 
 * @example
 * // 기본 입력 필드
 * <Input placeholder="이메일을 입력하세요" />
 * 
 * // 라벨이 있는 입력 필드
 * <Input label="이메일" id="email" type="email" />
 * 
 * // 에러 상태
 * <Input 
 *   label="비밀번호" 
 *   error="비밀번호는 6자 이상이어야 합니다" 
 * />
 * 
 * // 비활성화 상태
 * <Input disabled value="수정 불가" />
 */

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    // 자동 ID 생성 (label과 연결을 위해)
    const inputId = id || (label ? `input-${label.replace(/\s/g, "-").toLowerCase()}` : undefined);
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-caption text-muted-foreground mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={errorId}
          className={`
            w-full px-4 py-4 rounded-xl border bg-background text-foreground text-body-lg
            placeholder:text-muted-foreground 
            focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
            transition-all duration-200 touch-target
            ${error ? "border-destructive" : "border-input"}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-2 text-caption text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
