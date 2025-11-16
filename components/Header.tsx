"use client";

import { usePathname } from "next/navigation";

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/tickets": "Tickets",
  "/dashboard/chat": "Chat",
  "/dashboard/profile": "Perfil",
  "/dashboard/calendar": "Agenda",
};

export default function Header() {
  const pathname = usePathname();
  
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

  return (
    <header className="sticky top-0 z-50 bg-[#1a1d2e] border-b border-gray-800/50 shadow-sm">
      <div className="px-6 py-4">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
      </div>
    </header>
  );
}

