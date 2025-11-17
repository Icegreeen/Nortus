"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useHeaderActions } from "@/contexts/HeaderActionsContext";

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/tickets": "Tickets",
  "/dashboard/chat": "Chat",
  "/dashboard/profile": "Visão 360° do Cliente",
  "/dashboard/plans": "Simulador de Planos",
};

interface HeaderProps {
  actions?: ReactNode;
}

export default function Header({ actions: propActions }: HeaderProps) {
  const pathname = usePathname();
  const { actions: stateActions } = useHeaderActions();
  
  const getTitle = () => {
    if (routeTitles[pathname]) {
      return routeTitles[pathname];
    }
    
    const matchingRoute = Object.keys(routeTitles).find((route) => 
      pathname.startsWith(route)
    );
    
    return matchingRoute ? routeTitles[matchingRoute] : "Dashboard";
  };

  const title = getTitle();
  const displayActions = propActions || stateActions;

  return (
    <header className="sticky top-0 z-50 bg-[#1a1d2e] border-b border-gray-800/50 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {displayActions && <div>{displayActions}</div>}
      </div>
    </header>
  );
}

