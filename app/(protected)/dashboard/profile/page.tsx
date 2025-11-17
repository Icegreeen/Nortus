"use client";

import { useState, useEffect } from "react";
import { view360API } from "@/lib/360view";
import { Client360, AISuggestion } from "@/types";
import { toast } from "sonner";

export default function ProfilePage() {
  const [data, setData] = useState<Client360 | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const clientData = await view360API.getClient360();
        setData(clientData);
      } catch (error) {
        toast.error("Erro ao carregar dados do cliente");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return dateString;
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "proposal":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "call":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case "history":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-400";
    if (confidence >= 0.6) return "text-yellow-400";
    return "text-orange-400";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-orange-400";
  };

  const handleSuggestionAction = (suggestion: AISuggestion) => {
    switch (suggestion.type) {
      case "proposal":
        toast.success("Proposta enviada!", {
          description: suggestion.title,
        });
        break;
      case "call":
        toast.info("Ligação agendada!", {
          description: suggestion.title,
        });
        break;
      case "history":
        toast.info("Histórico aberto", {
          description: suggestion.title,
        });
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1117] p-6">
        <div className="space-y-6">
          <div className="h-64 bg-[#1a1d2e]/50 rounded-lg animate-pulse"></div>
          <div className="h-96 bg-[#1a1d2e]/50 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0f1117] p-6">
        <div className="text-center text-white">Erro ao carregar dados do cliente</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header com perfil do cliente */}
        <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-2xl font-bold">
                {data.client.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">{data.client.name}</h1>
                <p className="text-gray-400 text-sm mb-2">{data.client.clientType}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                  {data.client.email && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{data.client.email}</span>
                    </div>
                  )}
                  {data.client.phone && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{data.client.phone}</span>
                    </div>
                  )}
                  {data.client.joinDate && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Cliente desde {data.client.joinDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Indicadores de Performance */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20">
              <h2 className="text-xl font-semibold text-white mb-6">Indicadores de Performance</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Lifetime Value</span>
                    <span className={`text-2xl font-bold ${getScoreColor(data.lifetimeValue || 0)}`}>
                      {formatCurrency(data.lifetimeValue || 0)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/30 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((data.lifetimeValue || 0) / 20000 * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Score de Expansão</span>
                    <span className={`text-2xl font-bold ${getScoreColor(data.expansionScore || 0)}`}>
                      {data.expansionScore || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/30 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${data.expansionScore || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Probabilidade de compra de produtos adicionais</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Score de Retenção</span>
                    <span className={`text-2xl font-bold ${getScoreColor(data.retentionScore || 0)}`}>
                      {data.retentionScore || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700/30 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${data.retentionScore || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Probabilidade de renovação</p>
                </div>
              </div>
            </div>

            {/* Produtos do Cliente */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20">
              <h2 className="text-xl font-semibold text-white mb-6">Produtos Contratados</h2>
              <div className="space-y-4">
                {data.produtos.map((produto, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50"
                  >
                    <div>
                      <p className="text-white font-medium">{produto.name}</p>
                      <p className="text-gray-400 text-sm">{formatCurrency(produto.value)}/mês</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        produto.status === "Ativo"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                      }`}
                    >
                      {produto.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sugestões da IA e Histórico */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sugestões da IA */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20">
              <h2 className="text-xl font-semibold text-white mb-6">Sugestões da IA</h2>
              <div className="space-y-4">
                {data.aiSuggestions?.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="bg-gradient-to-r from-blue-600/10 to-blue-800/10 border border-blue-500/30 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400">
                          {getSuggestionIcon(suggestion.type)}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{suggestion.title}</h3>
                          <p className="text-gray-400 text-sm">{suggestion.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${getConfidenceColor(suggestion.confidence)}`}>
                          {Math.round(suggestion.confidence * 100)}% confiança
                        </span>
                      </div>
                    </div>
                    {suggestion.reason && (
                      <div className="mb-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                        <p className="text-sm text-gray-300">
                          <span className="font-semibold text-blue-400">Motivo: </span>
                          {suggestion.reason}
                        </p>
                      </div>
                    )}
                    <button
                      onClick={() => handleSuggestionAction(suggestion)}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      {suggestion.type === "proposal" && "Enviar Proposta"}
                      {suggestion.type === "call" && "Agendar Ligação"}
                      {suggestion.type === "history" && "Ver Histórico"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Histórico de Interações */}
            <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20">
              <h2 className="text-xl font-semibold text-white mb-6">Histórico de Interações</h2>
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {data.chatHistory && data.chatHistory.length > 0 ? (
                  data.chatHistory.map((message, index) => {
                    const showDateLabel = index === 0 || 
                      new Date(message.timestamp).toDateString() !== 
                      new Date(data.chatHistory![index - 1].timestamp).toDateString();
                    
                    return (
                      <div key={message.id}>
                        {showDateLabel && (
                          <div className="flex justify-center my-4">
                            <div className="bg-[#202435] px-4 py-2 rounded-full">
                              <span className="text-gray-400 text-sm">{formatDateLabel(message.timestamp)}</span>
                            </div>
                          </div>
                        )}
                        <div className={`flex ${message.role === "user" ? "justify-start" : "justify-end"}`}>
                          <div className={`max-w-md ${message.role === "user" ? "ml-0" : "mr-0"}`}>
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
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    Nenhuma interação registrada
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

