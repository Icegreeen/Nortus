import axios from "axios";
import Cookies from "js-cookie";
import { LoginCredentials, AuthResponse, Ticket, KPI, ChatMessage, AISuggestion } from "@/types";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (credentials.email === "admin@nortus.com" && credentials.password === "admin123") {
      return {
        token: "mock_jwt_token_" + Date.now(),
        user: {
          id: "1",
          name: "Admin User",
          email: "admin@nortus.com",
          role: "manager",
        },
      };
    }
    
    throw new Error("Credenciais inválidas");
  },
};

export const ticketsAPI = {
  getAll: async (): Promise<Ticket[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [
      {
        id: "1",
        title: "Problema no sistema de pagamento",
        description: "Cliente não consegue realizar pagamento",
        status: "open",
        priority: "urgent",
        assignedTo: "user1",
        createdBy: "user2",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Dúvida sobre plano Premium",
        description: "Cliente quer entender benefícios do plano Premium",
        status: "in_progress",
        priority: "medium",
        assignedTo: "user1",
        createdBy: "user3",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  },
  
  create: async (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">): Promise<Ticket> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      ...ticket,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
  
  update: async (id: string, ticket: Partial<Ticket>): Promise<Ticket> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id,
      title: ticket.title || "",
      description: ticket.description || "",
      status: ticket.status || "open",
      priority: ticket.priority || "low",
      assignedTo: ticket.assignedTo,
      createdBy: ticket.createdBy || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
};

export const kpiAPI = {
  getKPIs: async (): Promise<KPI[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [
      { arpu: 450, retention: 85, churn: 5, conversion: 12, period: "2024-01" },
      { arpu: 480, retention: 87, churn: 4, conversion: 14, period: "2024-02" },
      { arpu: 520, retention: 88, churn: 4, conversion: 15, period: "2024-03" },
      { arpu: 550, retention: 89, churn: 3, conversion: 16, period: "2024-04" },
      { arpu: 580, retention: 90, churn: 3, conversion: 17, period: "2024-05" },
      { arpu: 600, retention: 91, churn: 2, conversion: 18, period: "2024-06" },
    ];
  },
};

export const chatAPI = {
  getMessages: async (): Promise<ChatMessage[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [];
  },
  
  sendMessage: async (content: string): Promise<ChatMessage> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
  },
  
  getSuggestions: async (): Promise<AISuggestion[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return [
      {
        id: "1",
        type: "proposal",
        title: "Enviar Proposta",
        description: "Sugestão de plano Premium baseada no perfil do cliente",
        confidence: 0.92,
      },
      {
        id: "2",
        type: "call",
        title: "Fazer Ligação",
        description: "Cliente demonstrou interesse em produtos adicionais",
        confidence: 0.85,
      },
      {
        id: "3",
        type: "history",
        title: "Ver Histórico",
        description: "Cliente tem histórico de 3 interações anteriores",
        confidence: 0.78,
      },
    ];
  },
};

export default api;

