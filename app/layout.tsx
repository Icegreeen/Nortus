import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Nortus - Inteligência Artificial para Vendas",
  description: "Solução de IA para times de vendas e atendimento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
          <Toaster 
            position="bottom-center" 
            toastOptions={{
              classNames: {
                toast: "toast-custom",
                success: "toast-success",
                error: "toast-error",
                info: "toast-info",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
