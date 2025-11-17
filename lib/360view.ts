import axios from "axios";
import { API_BASE_URL } from "./config";
import { Client360, ChatMessage, AISuggestion } from "@/types";

export const view360API = {
  getClient360: async (): Promise<Client360> => {
    try {
      const url = `${API_BASE_URL}/360-view.json`;
      const response = await axios.get(url, {
        withCredentials: false,
      });

      const data = response.data;
      
      const mockChatHistory: ChatMessage[] = [
        {
          id: "1",
          role: "user",
          content: "Oi! Tudo certo? Gostaria de saber sobre o seguro automóvel",
          timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        },
        {
          id: "2",
          role: "assistant",
          content: "Oi, Ricardo! Tudo ótimo e com você? Claro que sim, posso te ajudar com o que precisar.",
          timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        },
        {
          id: "3",
          role: "user",
          content: "Isso! Mas agora fiquei pensando... tem alguma coisa além disso? Tipo, pros meus equipamentos",
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          id: "4",
          role: "assistant",
          content: "Perfeito! Para seus equipamentos, temos a cobertura adicional que protege acessórios, som e componentes personalizados do veículo.",
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
      ];

      const mockAISuggestions: AISuggestion[] = [
        {
          id: "suggestion-1",
          type: "proposal",
          title: "Recomendar Seguro de Equipamentos",
          description: "Cliente demonstrou interesse em cobertura adicional para equipamentos",
          confidence: 0.92,
          reason: "Cliente mencionou interesse em proteger equipamentos durante conversa anterior. Histórico positivo de 6 meses sem sinistros.",
        },
        {
          id: "suggestion-2",
          type: "proposal",
          title: "Upgrade para Plano Premium",
          description: "Cliente tem perfil ideal para plano premium com desconto",
          confidence: 0.85,
          reason: "Cliente intermediário com histórico positivo. Lifetime value acima da média. Probabilidade alta de conversão com desconto de 15%.",
        },
        {
          id: "suggestion-3",
          type: "call",
          title: "Ligação de Follow-up",
          description: "Seguir com proposta de equipamentos após 48h",
          confidence: 0.78,
          reason: "Cliente demonstrou interesse mas não finalizou. Follow-up personalizado pode aumentar conversão em 30%.",
        },
      ];

      return {
        ...data,
        client: {
          ...data.client,
          email: "ricardo.leite@email.com",
          phone: "(81) 98765-4321",
          joinDate: "15/06/2024",
        },
        lifetimeValue: 12500.50,
        expansionScore: 78,
        retentionScore: 92,
        chatHistory: mockChatHistory,
        aiSuggestions: mockAISuggestions,
      } as Client360;
    } catch (error: any) {
      console.error("Erro ao buscar dados da visão 360°:", error);
      return {
        client: {
          name: "Ricardo Leite",
          clientType: "Cliente Intermediário",
          email: "ricardo.leite@email.com",
          phone: "(81) 98765-4321",
          joinDate: "15/06/2024",
        },
        produtos: [],
        lifetimeValue: 0,
        expansionScore: 0,
        retentionScore: 0,
        chatHistory: [],
        aiSuggestions: [],
      };
    }
  },
};

