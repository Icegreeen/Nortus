"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/schemas/auth.schema";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberUser, setRememberUser] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Erro ao fazer login. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#0B1125] flex p-24">
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">

        <h1 className="text-5xl md:text-6xl font-bold text-[#1876D2] tracking-tight absolute top-[70px]">
          Nortus
        </h1>
        
        <div className="mb-16">  
            <div>
              <h2 className="text-4xl md:text-3xl font-semibold text-[#E3E3E3] mb-3">
                Login
              </h2>
              <p className="text-[#E3E3E3] text-base md:text-lg">
                Entre com suas credenciais para acessar a sua conta.
              </p>
            </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#E3E3E3] mb-2"
            >
              Usuário*
            </label>
            <div className="relative group">
              <input
                id="email"
                type="text"
                {...register("email")}
                className="w-full px-4 py-3.5 bg-[#0B1125] backdrop-blur-sm border border-[#737677]  rounded-[20px] text-white placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                placeholder="Usuário*"
              />
              <p className="mt-1.5 text-xs text-gray-400">
                Insira o seu e-mail, CPF ou passaporte.
              </p>
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5">
                <span>⚠</span>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#E3E3E3] mb-2"
            >
              Senha*
            </label>
            <div className="relative group">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full px-4 py-3.5 pr-12 bg-none bg-[#0B1125] backdrop-blur-sm border border-[#737677] rounded-[20px] text-white placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                placeholder="Senha*"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5">
                <span>⚠</span>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberUser}
                  onChange={(e) => setRememberUser(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                  rememberUser 
                    ? 'bg-[#1876D2] border-[#1876D2] shadow-lg shadow-blue-500/30' 
                    : 'border-[#737677] bg-transparent group-hover:border-cyan-400/50'
                }`}>
                  {rememberUser && (
                    <svg 
                      className="w-3.5 h-3.5 text-white transition-opacity duration-150" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={3} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-[#E3E3E3] group-hover:text-white transition-colors">
                Lembrar meu usuário
              </span>
            </label>

            <a
              href="#"
              className="text-sm text-[#1876D2] hover:text-cyan-300 transition-colors font-medium"
            >
              Esqueci minha senha
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1876D2] hover:bg-blue-900 text-white font-semibold py-4 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </span>
            ) : (
              "Entrar"
            )}
          </button>

          <div className="pt-6 border-t border-white/10 text-sm text-gray-400">
            <p>
              Credenciais de teste:&nbsp;
              <span className="font-medium text-white">
                ricardo.leite@email.com / user_001
              </span>
            </p>
          </div>
        </form>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute p-8 right-[-15px] flex gap-3 z-10 bg-[#0B1125] rounded-[20px]">
          
          <button className="bg-gray-800/80 backdrop-blur-sm rounded-xl px-5 py-3 flex items-center gap-2 text-gray-200 hover:bg-gray-700 transition-colors border border-gray-700/60 shadow-lg shadow-black/40">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-200">Ajuda</span>
          </button>

          <button className="bg-gray-800/80 backdrop-blur-sm rounded-xl px-5 py-3 flex items-center gap-2 text-gray-200 hover:bg-gray-700 transition-colors border border-gray-700/60 shadow-lg shadow-black/40">
            <span className="text-base">🇧🇷</span>
            <span className="text-sm font-medium text-gray-200">PT-br</span>
            <svg className="w-4 h-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <div className="absolute inset-0">
          <Image
            src="/image-login.png"
            alt="Nortus Login Illustration"
            fill
            className="object-cover object-center rounded-[60px]"
            priority
            sizes="50vw"
          />
        </div>
      </div>
    </div>
  );
}
