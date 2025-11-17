"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface HeaderActionsContextType {
  actions: ReactNode;
  setActions: (actions: ReactNode) => void;
}

const HeaderActionsContext = createContext<HeaderActionsContextType | undefined>(undefined);

export function HeaderActionsProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<ReactNode>(null);

  return (
    <HeaderActionsContext.Provider value={{ actions, setActions }}>
      {children}
    </HeaderActionsContext.Provider>
  );
}

export function useHeaderActions() {
  const context = useContext(HeaderActionsContext);
  if (!context) {
    throw new Error("useHeaderActions must be used within HeaderActionsProvider");
  }
  return context;
}

