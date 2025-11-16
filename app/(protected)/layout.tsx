"use client";

import { TicketsProvider } from "@/contexts/TicketsContext";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <TicketsProvider>
      <div className="min-h-screen bg-[#0f1117] flex">
        <Sidebar />
        <div className="flex-1 ml-20 transition-all duration-300 flex flex-col relative z-10">
          <Header />
          <main className="flex-1 overflow-auto relative z-10">
            {children}
          </main>
        </div>
      </div>
    </TicketsProvider>
  );
}

