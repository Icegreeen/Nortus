import { Ticket } from "@/types";

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


