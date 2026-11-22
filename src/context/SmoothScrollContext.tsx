import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import type { SmoothScrollContextValue } from "../hooks/useSmoothScroll";

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

export function SmoothScrollContextProvider({
  value,
  children,
}: {
  value: SmoothScrollContextValue;
  children: ReactNode;
}) {
  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useLenisContext(): SmoothScrollContextValue {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx) {
    throw new Error(
      "useLenisContext must be used within a SmoothScrollContextProvider",
    );
  }
  return ctx;
}
