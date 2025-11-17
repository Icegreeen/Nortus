export interface User {
  id: string;
  name: string;
  email: string;
  role: "operator" | "manager" | "consultant" | "analyst";
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Ticket {
  id: string;
  priority: "Urgente" | "Média" | "Baixa";
  client: string;
  email: string;
  subject: string;
  status: "Aberto" | "Em andamento" | "Resolvido" | "Fechado";
  createdAt: string;
  responsible: string;
}

export interface TicketResumo {
  open: number;
  inProgress: number;
  solved: number;
  timeAverageHours: number;
}

export interface TicketManagementResponse {
  resumo: TicketResumo;
  status: string[];
  priorities: string[];
  tickets: Ticket[];
}

export interface KPI {
  arpu: number;
  retention: number;
  churn: number;
  conversion: number;
  period: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AISuggestion {
  id: string;
  type: "proposal" | "call" | "history";
  title: string;
  description: string;
  confidence: number;
}

