import { AISuggestion, ChatMessage } from "@/types";

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


