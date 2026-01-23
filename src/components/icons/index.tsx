import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};

const defaultProps: IconProps = {
  className: "w-5 h-5",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function SearchIcon({ size, className, ...props }: IconProps) {
  return (
    <svg 
      {...defaultProps} 
      className={className || `w-${size || 5} h-${size || 5}`}
      {...props}
      aria-hidden="true"
    >
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

export function ChevronLeftIcon({ size, className, ...props }: IconProps) {
  return (
    <svg 
      {...defaultProps}
      className={className || `w-${size || 5} h-${size || 5}`}
      {...props}
      aria-hidden="true"
    >
      <path d="M15 19l-7-7 7-7" />
    </svg>
  );
}

export function ChevronRightIcon({ size, className, ...props }: IconProps) {
  return (
    <svg 
      {...defaultProps}
      className={className || `w-${size || 5} h-${size || 5}`}
      {...props}
      aria-hidden="true"
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function PlusIcon({ size, className, ...props }: IconProps) {
  return (
    <svg 
      {...defaultProps}
      className={className || `w-${size || 5} h-${size || 5}`}
      {...props}
      aria-hidden="true"
    >
      <path d="M12 4v16m8-8H4" />
    </svg>
  );
}

export function CloseIcon({ size, className, ...props }: IconProps) {
  return (
    <svg 
      {...defaultProps}
      className={className || `w-${size || 5} h-${size || 5}`}
      {...props}
      aria-hidden="true"
    >
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export function CheckIcon({ size, className, ...props }: IconProps) {
  return (
    <svg 
      {...defaultProps}
      className={className || `w-${size || 5} h-${size || 5}`}
      {...props}
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function BellIcon({ size, className, ...props }: IconProps) {
  return (
    <svg 
      {...defaultProps}
      className={className || `w-${size || 6} h-${size || 6}`}
      {...props}
      aria-hidden="true"
    >
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

export function DocumentIcon({ size, className, ...props }: IconProps) {
  return (
    <svg 
      {...defaultProps}
      className={className || `w-${size || 6} h-${size || 6}`}
      {...props}
      aria-hidden="true"
    >
      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

export function ChatIcon({ size, className, ...props }: IconProps) {
  return (
    <svg 
      {...defaultProps}
      className={className || `w-${size || 6} h-${size || 6}`}
      {...props}
      aria-hidden="true"
    >
      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

export function UserIcon({ size, className, ...props }: IconProps) {
  return (
    <svg 
      {...defaultProps}
      className={className || `w-${size || 6} h-${size || 6}`}
      {...props}
      aria-hidden="true"
    >
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

export function SortIcon({ size, className, ...props }: IconProps) {
  return (
    <svg 
      {...defaultProps}
      className={className || `w-${size || 4} h-${size || 4}`}
      {...props}
      aria-hidden="true"
    >
      <path d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    </svg>
  );
}

export function ChartIcon({ size, className, ...props }: IconProps) {
  return (
    <svg 
      {...defaultProps}
      className={className || `w-${size || 6} h-${size || 6}`}
      {...props}
      aria-hidden="true"
    >
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

export function EyeIcon({ size, className, ...props }: IconProps) {
  return (
    <svg 
      {...defaultProps}
      className={className || `w-${size || 5} h-${size || 5}`}
      {...props}
      aria-hidden="true"
    >
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

export function EyeOffIcon({ size, className, ...props }: IconProps) {
  return (
    <svg 
      {...defaultProps}
      className={className || `w-${size || 5} h-${size || 5}`}
      {...props}
      aria-hidden="true"
    >
      <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

export function WarningIcon({ size, className, ...props }: IconProps) {
  return (
    <svg 
      {...defaultProps}
      className={className || `w-${size || 4} h-${size || 4}`}
      {...props}
      aria-hidden="true"
    >
      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

// Google 로고 아이콘
export function GoogleIcon({ size, className, ...props }: IconProps) {
  return (
    <svg 
      viewBox="0 0 24 24"
      className={className || `w-${size || 5} h-${size || 5}`}
      {...props}
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

// 카카오 로고 아이콘
export function KakaoIcon({ size, className, ...props }: IconProps) {
  return (
    <svg 
      viewBox="0 0 24 24"
      className={className || `w-${size || 5} h-${size || 5}`}
      {...props}
      aria-hidden="true"
    >
      <path
        fill="#000000"
        d="M12 3c-5.523 0-10 3.91-10 8.731 0 3.065 1.944 5.753 4.889 7.293-.158.52-.609 2.003-.698 2.314-.109.382.14.377.295.274.121-.08 1.931-1.308 2.712-1.838.894.131 1.823.2 2.802.2 5.523 0 10-3.91 10-8.731C22 6.91 17.523 3 12 3z"
      />
    </svg>
  );
}
