import { ReactNode, createContext, useContext, useState } from "react";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
  onChange?: (value: string) => void;
}

/**
 * 탭 컨테이너 컴포넌트
 */
export function Tabs({ defaultValue, children, className = "", onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

/**
 * 탭 버튼 목록 컴포넌트
 */
export function TabsList({ children, className = "" }: TabsListProps) {
  return (
    <div 
      role="tablist" 
      className={`flex gap-2 overflow-x-auto scrollbar-hide ${className}`}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

/**
 * 개별 탭 버튼 컴포넌트
 */
export function TabsTrigger({ value, children, icon, className = "" }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      onClick={() => setActiveTab(value)}
      className={`
        flex items-center gap-1.5 px-4 py-2 rounded-full text-caption font-medium 
        whitespace-nowrap transition-all
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        ${isActive 
          ? "bg-primary text-primary-foreground shadow-md" 
          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
        }
        ${className}
      `}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

/**
 * 탭 컨텐츠 패널 컴포넌트
 */
export function TabsContent({ value, children, className = "" }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  const { activeTab } = context;

  if (activeTab !== value) return null;

  return (
    <div 
      role="tabpanel" 
      id={`tabpanel-${value}`}
      className={className}
    >
      {children}
    </div>
  );
}
