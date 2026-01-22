// Authentication & User
export { useAuth } from "../contexts/AuthContext";

// Data Hooks
export { useContracts } from "./useContracts";
export { useCredits } from "./useCredits";
export { useChat, useChatMessages } from "./useChat";

// AI & Generation
export { useAIChat } from "./useAIChat";
export { useContractGeneration } from "./useContractGeneration";

// UI & Interaction
export { useSwipe } from "./useSwipe";
export { useRealtime } from "./useRealtime";

// Utility Hooks
export { useOnlineStatus } from "./useOnlineStatus";
export { useDebounce } from "./useDebounce";
export { useLocalStorage } from "./useLocalStorage";
export { useFormValidation, validationRules } from "./useFormValidation";
export { useUnsavedChanges, useConfirmDialog } from "./useUnsavedChanges";
export { useThrottle, useThrottledCallback, useDebouncedCallback } from "./useThrottle";
export { useOptimisticUpdate, useOptimisticList } from "./useOptimisticUpdate";
export { useSessionTimeout } from "./useSessionTimeout";
export { useOfflineCache, useOfflineNotice } from "./useOfflineCache";
export { useResource, useSingleResource } from "./useResource";
export { usePrefetch, useLinkPrefetch, useImagePreload } from "./usePrefetch";
