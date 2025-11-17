"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "line-graph" },
  { name: "Tickets", href: "/dashboard/tickets", icon: "/assets/icons/ticket.png" },
  { name: "Chat", href: "/dashboard/chat", icon: "/assets/icons/chat.png" },
  { name: "Perfil", href: "/dashboard/profile", icon: "/assets/icons/user.png" },
  { name: "Plan", href: "/dashboard/plans", icon: "/assets/icons/calendar.png" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    router.push("/login");
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const getIcon = (iconName: string, isActive: boolean) => {
    if (iconName.startsWith("/")) {
      return (
        <Image
          src={iconName}
          alt=""
          width={24}
          height={24}
          className={cn(
            "w-6 h-6",
            isActive ? "opacity-100" : "opacity-60"
          )}
        />
      );
    }
    
    switch (iconName) {
      case "line-graph":
        return (
          <svg
            className={cn("w-6 h-6", isActive ? "text-white" : "text-gray-400")}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        );
      case "briefcase":
        return (
          <svg
            className={cn("w-6 h-6", isActive ? "text-white" : "text-gray-400")}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case "chat":
        return (
          <svg
            className={cn("w-6 h-6", isActive ? "text-white" : "text-gray-400")}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        );
      case "person":
        return (
          <svg
            className={cn("w-6 h-6", isActive ? "text-white" : "text-gray-400")}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        );
      case "calendar":
        return (
          <svg
            className={cn("w-6 h-6", isActive ? "text-white" : "text-gray-400")}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[80px] bg-[#1a1d2e] border-r border-gray-800/50 flex flex-col items-center py-5 z-50">
      <div className="mb-6 flex items-center justify-center">
        <div className="relative w-12 h-14 flex items-center justify-center">
          <Image src="/assets/icons/logo.png" alt="Logo" width={48} height={56} className="w-12 h-14" quality={100}/>
        </div>
      </div>

      <nav className="flex-1 space-y-5 flex flex-col items-center justify-center w-full">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/dashboard" && pathname === "/dashboard") ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
                  : "text-gray-400 hover:bg-gray-700/50 hover:text-gray-200"
              )}
              title={item.name}
            >
              {getIcon(item.icon, isActive)}
            </Link>
          );
        })}
      </nav>

      <div className="relative mb-2" ref={userMenuRef}>
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-colors cursor-pointer"
          title={user?.email || "Usuário"}
        >
          {user?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "AC"}
        </button>

        {isUserMenuOpen && (
          <div className="fixed bottom-4 left-[88px] w-56 bg-[#1a1d2e] border border-gray-800/50 rounded-lg shadow-xl z-[10000] py-2">
            <div className="px-4 py-3 border-b border-gray-800/50">
              {user?.name && (
                <p className="text-white font-semibold text-sm mb-1">{user.name}</p>
              )}
              {user?.email && (
                <p className="text-gray-400 text-xs truncate">{user.email}</p>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700/50 transition-colors text-sm flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sair
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
