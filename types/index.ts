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
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "urgent" | "medium" | "low";
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
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

