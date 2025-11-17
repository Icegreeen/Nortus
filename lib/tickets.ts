import axios from "axios";
import { API_BASE_URL } from "./config";
import { Ticket, TicketManagementResponse } from "@/types";

export const ticketsAPI = {
  getTicketManagement: async (): Promise<TicketManagementResponse> => {
    try {
      const url = `${API_BASE_URL}/ticket-management.json`;
      const response = await axios.get(url, {
        withCredentials: false,
      });

      return response.data as TicketManagementResponse;
    } catch (error: any) {
      console.error("Erro ao buscar dados de tickets:", error);
      return {
        resumo: {
          open: 0,
          inProgress: 0,
          solved: 0,
          timeAverageHours: 0,
        },
        status: [],
        priorities: [],
        tickets: [],
      };
    }
  },

  create: async (ticket: {
    clientName: string;
    email: string;
    priority: "Urgente" | "Média" | "Baixa";
    responsible: string;
    subject: string;
  }): Promise<Ticket> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    return {
      id: `TK${String(Date.now()).slice(-3)}`,
      priority: ticket.priority,
      client: ticket.clientName,
      email: ticket.email,
      subject: ticket.subject,
      status: "Aberto",
      createdAt: `${day}/${month}/${year}`,
      responsible: ticket.responsible,
    };
  },

  update: async (id: string, ticket: Partial<{
    clientName: string;
    email: string;
    priority: "Urgente" | "Média" | "Baixa";
    responsible: string;
    subject: string;
    status: "Aberto" | "Em andamento" | "Resolvido" | "Fechado";
  }>): Promise<Ticket> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id,
      priority: ticket.priority || "Média",
      client: ticket.clientName || "",
      email: ticket.email || "",
      subject: ticket.subject || "",
      status: ticket.status || "Aberto",
      createdAt: new Date().toLocaleDateString("pt-BR"),
      responsible: ticket.responsible || "",
    };
  },

  getById: async (id: string): Promise<Ticket | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return null;
  },
};


