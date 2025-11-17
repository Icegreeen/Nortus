"use client";

import { useState, useEffect, useRef } from "react";
import { chatAPI } from "@/lib/api";
import { ChatMessage, AISuggestion } from "@/types";
import { toast } from "sonner";

interface ChatMessageWithMetadata extends ChatMessage {
  sender?: string;
  read?: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageWithMetadata[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<AISuggestion | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const messagesData = await chatAPI.getMessages();
        const mockMessages: ChatMessageWithMetadata[] = [
          {
            id: "1",
            role: "user",
            content: "Oi! Tudo certo? Gostaria de saber sobre o seguro automóvel",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            sender: "Ricardo Leite - Seguro Automóvel",
            read: true,
          },
          {
            id: "2",
            role: "assistant",
            content: "Oi, Ricardo! Tudo ótimo e com você? Claro que sim, posso te ajudar com o que precisar. Vi aqui que você tá com a gente há 6 meses com o seguro de automóvel, é isso mesmo?",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: "3",
            role: "user",
            content: "Isso! Mas agora fiquei pensando... tem alguma coisa além disso? Tipo, pros meus equipamentos",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            sender: "Ricardo Leite - Seguro Automóvel",
            read: true,
          },
        ];
        
        setMessages(mockMessages.length > 0 ? mockMessages : messagesData);
        
        if (mockMessages.length > 2) {
          const initialSuggestion: AISuggestion = {
            id: "suggestion-1",
            type: "proposal",
            title: "Baseado no perfil do cliente, recomendo a oferta Premium com desconto de 15%. Cliente tem histórico positivo.",
            description: "",
            confidence: 0.92,
          };
          setActiveSuggestion(initialSuggestion);
        }
      } catch (error) {
        toast.error("Erro ao carregar chat");
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const generateAIResponse = (userMessage: string): string => {
    if (!userMessage || !userMessage.trim()) {
      return "Olá! Como posso ajudar você hoje?";
    }

    const lowerMessage = userMessage.toLowerCase().trim();
    
    if (lowerMessage.includes("equipamento") || lowerMessage.includes("equipamentos")) {
      return "Perfeito! Para seus equipamentos, temos a cobertura adicional que protege acessórios, som e componentes personalizados do veículo. Quer que eu detalhe mais sobre essa opção?";
    }
    
    if (lowerMessage.includes("preço") || lowerMessage.includes("quanto") || lowerMessage.includes("valor") || lowerMessage.includes("custa")) {
      return "Tenho algumas opções de preço que podem se encaixar no seu perfil! Posso enviar uma proposta personalizada com desconto especial. Quer que eu prepare?";
    }
    
    if (lowerMessage.includes("desconto") || lowerMessage.includes("promoção") || lowerMessage.includes("promocao")) {
      return "Excelente! Como você é cliente há 6 meses, temos um desconto especial de até 15% para você. Quer que eu calcule o valor com desconto?";
    }
    
    if (lowerMessage.includes("obrigado") || lowerMessage.includes("valeu") || lowerMessage.includes("agradeço") || lowerMessage.includes("agradeco")) {
      return "Por nada, Ricardo! Fico feliz em ajudar. Se precisar de mais alguma coisa ou tiver outras dúvidas, é só falar!";
    }
    
    if (lowerMessage.includes("seguro") || lowerMessage.includes("cobertura")) {
      return "Claro! Posso te ajudar com todas as opções de seguro e cobertura que temos. Temos planos Básico, Intermediário e Premium, cada um com benefícios diferentes. Qual te interessa mais?";
    }

    if (lowerMessage.includes("oi") || lowerMessage.includes("olá") || lowerMessage.includes("ola") || lowerMessage.includes("bom dia") || lowerMessage.includes("boa tarde") || lowerMessage.includes("boa noite")) {
      return "Oi, Ricardo! Tudo ótimo e com você? Como posso ajudar você hoje?";
    }

    return "Entendi! Deixa eu verificar aqui as melhores opções para você. Baseado no seu perfil, tenho algumas recomendações personalizadas. Quer que eu mostre?";
  };

  const generateSuggestion = (userMessage: string, aiResponse: string): AISuggestion | null => {
    const lowerMessage = userMessage.toLowerCase();
    const lowerResponse = aiResponse.toLowerCase();
    
    if (lowerMessage.includes("equipamento") || lowerMessage.includes("equipamentos")) {
      return {
        id: Date.now().toString(),
        type: "proposal",
        title: "Baseado no interesse por equipamentos, recomendo a cobertura adicional Premium. Cliente tem perfil compatível.",
        description: "",
        confidence: 0.88,
      };
    }
    
    if (lowerMessage.includes("preço") || lowerResponse.includes("desconto")) {
      return {
        id: Date.now().toString(),
        type: "proposal",
        title: "Oportunidade de envio de proposta com desconto de 15%. Cliente demonstrou interesse em valores.",
        description: "",
        confidence: 0.90,
      };
    }
    
    return {
      id: Date.now().toString(),
      type: "proposal",
      title: "Baseado no perfil do cliente, recomendo a oferta Premium com desconto de 15%. Cliente tem histórico positivo.",
      description: "",
      confidence: 0.92,
    };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessageContent = input.trim();
    const userMessage: ChatMessageWithMetadata = {
      id: Date.now().toString(),
      role: "user",
      content: userMessageContent,
      timestamp: new Date().toISOString(),
      sender: "Ricardo Leite - Seguro Automóvel",
      read: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(async () => {
      try {
        await chatAPI.sendMessage(userMessageContent);

        const aiResponse = generateAIResponse(userMessageContent);
        
        const typingDelay = Math.min(aiResponse.length * 20, 2000);
        
        setTimeout(() => {
          const aiMessage: ChatMessageWithMetadata = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: aiResponse,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, aiMessage]);
          setIsTyping(false);
          
          const suggestion = generateSuggestion(userMessageContent, aiResponse);
          if (suggestion) {
            setActiveSuggestion(suggestion);
          }
        }, typingDelay);
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Erro ao enviar mensagem");
        setIsTyping(false);
        setLoading(false);
      }
    }, 500);
  };

  const handleSuggestionAction = (action: "proposal" | "call" | "history") => {
    const actionLabels = {
      proposal: "Enviar proposta",
      call: "Fazer ligação",
      history: "Ver histórico",
    };
    toast.success(`${actionLabels[action]} executado com sucesso!`);
    
    setActiveSuggestion(null);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateLabel = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return "HOJE, " + date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="h-[calc(100vh-12rem)] flex flex-col bg-[#1a1d2e] rounded-2xl overflow-hidden border border-gray-800/50 shadow-xl shadow-black/20">
        <div className="p-6 border-b border-gray-800/50">
          <h1 className="text-xl font-semibold text-white">Chat & Assistente Virtual</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length > 0 && (
            <div className="flex justify-center">
              <div className="bg-[#202435] px-4 py-2 rounded-full">
                <span className="text-gray-400 text-sm">{formatDateLabel(messages[0].timestamp)}</span>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}
            >
              <div className={`max-w-md ${message.role === "user" ? "ml-0" : "mr-0"}`}>
                {message.role === "user" && message.sender && (
                  <p className="text-blue-400 text-sm mb-1 ml-1">{message.sender}</p>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700/80 text-white"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <span
                      className={`text-xs ${
                        message.role === "user" ? "text-blue-200" : "text-gray-400"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </span>
                    {message.role === "user" && message.read && (
                      <>
                        <svg
                          className="w-3 h-3 text-blue-200"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <svg
                          className="w-3 h-3 text-blue-200"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {activeSuggestion && messages.length > 2 && (
            <div className="flex justify-end">
              <div className="max-w-md bg-gray-700/80 rounded-2xl p-4 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                  </svg>
                  <span className="text-white text-sm font-semibold">Sugestão da IA</span>
                  <span className="text-gray-400 text-xs ml-auto">
                    {formatTime(new Date().toISOString())}
                  </span>
                </div>
                <p className="text-white text-sm">{activeSuggestion.title}</p>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => handleSuggestionAction("proposal")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg font-medium transition-colors"
                  >
                    Enviar proposta
                  </button>
                  <button
                    onClick={() => handleSuggestionAction("call")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg font-medium transition-colors"
                  >
                    Fazer ligação
                  </button>
                  <button
                    onClick={() => handleSuggestionAction("history")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg font-medium transition-colors"
                  >
                    Ver histórico
                  </button>
                </div>
              </div>
            </div>
          )}

          {isTyping && (
            <div className="flex justify-end">
              <div className="bg-gray-700/80 px-4 py-3 rounded-2xl">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="mt-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escreva aqui..."
            className="flex-1 px-4 py-3 bg-[#1a1d2e] border border-gray-800/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </>
  );
}
