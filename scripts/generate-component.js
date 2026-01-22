#!/usr/bin/env node

/**
 * 컴포넌트 생성 스크립트
 * 
 * 사용법:
 *   node scripts/generate-component.js ComponentName
 *   node scripts/generate-component.js ComponentName --type=page
 *   node scripts/generate-component.js ComponentName --type=hook
 * 
 * 옵션:
 *   --type=component (기본값)
 *   --type=page
 *   --type=hook
 *   --dir=custom/path
 */

const fs = require("fs");
const path = require("path");

// 명령행 인자 파싱
const args = process.argv.slice(2);
const name = args[0];
const options = {};

args.slice(1).forEach((arg) => {
  if (arg.startsWith("--")) {
    const [key, value] = arg.slice(2).split("=");
    options[key] = value;
  }
});

const type = options.type || "component";
const customDir = options.dir;

if (!name) {
  console.error("❌ 컴포넌트 이름을 입력해주세요.");
  console.log("\n사용법:");
  console.log("  node scripts/generate-component.js ComponentName");
  console.log("  node scripts/generate-component.js ComponentName --type=page");
  console.log("  node scripts/generate-component.js ComponentName --type=hook");
  process.exit(1);
}

// 이름 변환 유틸
const toPascalCase = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const toCamelCase = (str) =>
  str.charAt(0).toLowerCase() + str.slice(1);

const toKebabCase = (str) =>
  str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

// 템플릿 생성
const templates = {
  component: (componentName) => `import { forwardRef, HTMLAttributes } from "react";

interface ${componentName}Props extends HTMLAttributes<HTMLDivElement> {
  /** 컴포넌트 설명 */
  variant?: "default" | "outline";
}

/**
 * ${componentName} 컴포넌트
 * 
 * @example
 * <${componentName} variant="default">
 *   내용
 * </${componentName}>
 */
export const ${componentName} = forwardRef<HTMLDivElement, ${componentName}Props>(
  ({ variant = "default", className = "", children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-card text-card-foreground",
      outline: "border border-border",
    };

    return (
      <div
        ref={ref}
        className={\`
          rounded-xl p-4
          \${variantClasses[variant]}
          \${className}
        \`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

${componentName}.displayName = "${componentName}";
`,

  page: (pageName) => `import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/layouts";
import { Button, LoadingSpinner, ErrorState } from "../components/ui";

/**
 * ${pageName} 페이지
 */
export default function ${pageName}() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 데이터 로드 로직
    const loadData = async () => {
      try {
        setIsLoading(true);
        // TODO: API 호출
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="${pageName}" onBack={() => navigate(-1)} />

      <main className="mobile-container py-6">
        <h1 className="text-heading font-semibold text-foreground mb-4">
          ${pageName}
        </h1>

        <p className="text-body text-muted-foreground">
          페이지 내용을 여기에 작성하세요.
        </p>
      </main>
    </div>
  );
}
`,

  hook: (hookName) => {
    const camelName = toCamelCase(hookName);
    return `import { useState, useEffect, useCallback } from "react";

interface Use${hookName}Options {
  /** 옵션 설명 */
  enabled?: boolean;
}

interface Use${hookName}Return {
  /** 반환값 설명 */
  data: unknown;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * ${camelName} 훅
 * 
 * @example
 * const { data, isLoading, error } = ${camelName}({ enabled: true });
 */
export function ${camelName}(options: Use${hookName}Options = {}): Use${hookName}Return {
  const { enabled = true } = options;
  
  const [data, setData] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // TODO: 실제 로직 구현
      await new Promise((resolve) => setTimeout(resolve, 500));
      setData({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}
`;
  },

  test: (componentName) => `import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ${componentName} } from "./${componentName}";

describe("${componentName}", () => {
  it("기본 렌더링이 동작한다", () => {
    render(<${componentName}>테스트</${componentName}>);
    expect(screen.getByText("테스트")).toBeInTheDocument();
  });

  it("variant prop이 적용된다", () => {
    render(<${componentName} variant="outline">테스트</${componentName}>);
    const element = screen.getByText("테스트").parentElement;
    expect(element).toHaveClass("border");
  });

  it("추가 className이 적용된다", () => {
    render(<${componentName} className="custom-class">테스트</${componentName}>);
    const element = screen.getByText("테스트").parentElement;
    expect(element).toHaveClass("custom-class");
  });
});
`,
};

// 디렉토리 결정
const getDirectory = () => {
  if (customDir) return path.join("src", customDir);
  
  switch (type) {
    case "page":
      return "src/pages";
    case "hook":
      return "src/hooks";
    default:
      return "src/components";
  }
};

// 파일 생성
const generateFiles = () => {
  const dir = getDirectory();
  const componentName = toPascalCase(name);
  const hookName = type === "hook" ? `use${componentName}` : componentName;
  const fileName = type === "hook" ? hookName : componentName;

  // 디렉토리 생성
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 메인 파일 생성
  const mainFilePath = path.join(dir, `${fileName}.tsx`);
  const mainContent = templates[type](type === "hook" ? componentName : componentName);

  if (fs.existsSync(mainFilePath)) {
    console.error(`❌ 파일이 이미 존재합니다: ${mainFilePath}`);
    process.exit(1);
  }

  fs.writeFileSync(mainFilePath, mainContent);
  console.log(`✅ 생성됨: ${mainFilePath}`);

  // 컴포넌트인 경우 테스트 파일도 생성
  if (type === "component") {
    const testFilePath = path.join(dir, `${fileName}.test.tsx`);
    fs.writeFileSync(testFilePath, templates.test(componentName));
    console.log(`✅ 생성됨: ${testFilePath}`);
  }

  console.log(`\n🎉 ${type} "${fileName}" 생성 완료!`);
};

generateFiles();
