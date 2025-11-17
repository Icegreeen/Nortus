"use client";

import { useState } from "react";
import { useTickets } from "@/contexts/TicketsContext";
import { Ticket } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketSchema, type TicketFormData } from "@/schemas/ticket.schema";
import { toast } from "sonner";
import Image from "next/image";
import Header from "@/components/Header";

const priorityColors: Record<string, string> = {
  Urgente: "bg-red-500/20 text-red-400 border-red-500/30",
  Média: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Baixa: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const statusColors: Record<string, string> = {
  Aberto: "bg-green-500/20 text-green-400 border-green-500/30",
  "Em andamento": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Resolvido: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Fechado: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function TicketsPage() {
  const { filteredTickets, loading, createTicket, resumo, searchQuery, setSearchQuery, filters, setFilters } = useTickets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
  });

  const handleCreate = async (data: TicketFormData) => {
    try {
      await createTicket({
        clientName: data.clientName,
        email: data.email,
        priority: data.priority,
        responsible: data.responsible,
        subject: data.subject,
      });
      setIsModalOpen(false);
      reset();
      toast.success("Ticket criado com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar ticket");
    }
  };

  const handleView = (ticket: Ticket) => {
    toast.info("Visualização de ticket em desenvolvimento");
  };

  const handleEdit = (ticket: Ticket) => {
    toast.info("Edição de ticket em desenvolvimento");
  };

  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;
  const currentTickets = filteredTickets.slice(startIndex, endIndex);

  const responsaveis = Array.from(new Set(filteredTickets.map((t) => t.responsible))).sort();

  if (loading) {
    return (
      <div className="min-h-screen  p-6">
        <div className="space-y-6">
          <div className="h-64 bg-[#1a1d2e]/50 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-[30px] font-semibold flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Novo Ticket
          </button>
        }
      />
      <div className="min-h-screen p-6">
        <div className="">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tickets Abertos */}
          <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20">
          <p className="text-gray-400 text-sm mb-1">Tickets Abertos</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-3xl font-bold">{resumo?.open || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center">
              <Image src="/assets/icons/tickets/card.svg" alt="Tickets Abertos" className="w-12 h-12" width={48} height={48} />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20">
          <p className="text-gray-400 text-sm mb-1">Em andamento</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-3xl font-bold">{resumo?.inProgress || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center">
              <Image src="/assets/icons/tickets/mensage.svg" alt="Tickets Abertos" className="w-12 h-12" width={48} height={48} />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20">
          <p className="text-gray-400 text-sm mb-1">Resolvidos hoje</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-3xl font-bold">{resumo?.solved || 0}</p>
              </div>
              <div className="w-12 h-12 rounded- flex items-center justify-center">
                <Image src="/assets/icons/tickets/check.svg" alt="Tickets Abertos" className="w-12 h-12" width={48} height={48} />
              </div>
            </div>
          </div>

          <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-gray-800/50 shadow-xl shadow-black/20">
          <p className="text-gray-400 text-sm mb-1">Tempo Médio</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-3xl font-bold">{resumo?.timeAverageHours || 0}h</p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                <Image src="/assets/icons/tickets/clock.svg" alt="Tickets Abertos" className="w-12 h-12" width={48} height={48} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1d2e] rounded-2xl p-6 mt-8 border border-gray-800/50 shadow-xl shadow-black/20">
          <h2 className="text-xl font-semibold text-white mb-6">Lista de Tickets</h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar por ID, cliente ou assunto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-[40px] bg-[#0B1125] border border-gray-600/50  text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={filters.status || ""}
                onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                className="bg-[#0B1125] border border-gray-600/50 rounded-[30px] pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%23ffffff' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                }}
              >
                <option value="">Todos os status</option>
                <option value="Aberto">Aberto</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Resolvido">Resolvido</option>
                <option value="Fechado">Fechado</option>
              </select>

              <select
                value={filters.priority || ""}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value || undefined })}
                className="bg-[#0B1125] border border-gray-600/50 rounded-[30px] pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%23ffffff' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                }}
              >
                <option value="">Todas as prioridades</option>
                <option value="Urgente">Urgente</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>
              </select>

              <select
                value={filters.responsible || ""}
                onChange={(e) => setFilters({ ...filters, responsible: e.target.value || undefined })}
                className="bg-[#0B1125] border border-gray-600/50 rounded-[30px] pl-4 pr-10 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2 4L6 8L10 4' stroke='%23ffffff' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                }}
              >
                <option value="">Todos os responsáveis</option>
                {responsaveis.map((resp) => (
                  <option key={resp} value={resp}>
                    {resp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto bg-[#202435] p-4 rounded-2xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800/50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Prioridade</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Cliente</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Assunto</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Criado em</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Responsável</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentTickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      Nenhum ticket encontrado
                    </td>
                  </tr>
                ) : (
                  currentTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors">
                      <td className="py-4 px-4 text-sm text-white font-medium">{ticket.id}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${priorityColors[ticket.priority] || priorityColors.Baixa}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-white font-medium">{ticket.client}</div>
                        <div className="text-xs text-gray-400">{ticket.email}</div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-300">{ticket.subject}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[ticket.status] || statusColors.Aberto}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-400">{ticket.createdAt}</td>
                      <td className="py-4 px-4 text-sm text-gray-300">{ticket.responsible}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleEdit(ticket)}
                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                          </button>
                          <button
                            onClick={() => handleView(ticket)}
                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
                          >
                            Ver
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg bg-gray-700/80 text-gray-300 hover:bg-gray-600/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                &lt;&lt;
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg bg-gray-700/80 text-gray-300 hover:bg-gray-600/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                &lt;
              </button>
              <span className="px-4 py-1.5 text-sm text-gray-300">
                {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg bg-gray-700/80 text-gray-300 hover:bg-gray-600/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                &gt;
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg bg-gray-700/80 text-gray-300 hover:bg-gray-600/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                &gt;&gt;
              </button>
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-[10000] p-4" onClick={() => setIsModalOpen(false)}>
            <div
              className="bg-[#0B1125] rounded-2xl border border-gray-800/50 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
                <h2 className="text-xl text-white">Novo Ticket</h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    reset();
                  }}
                  className="w-8 h-8 rounded-full bg-gray-700/80 hover:bg-gray-600/80 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <p className="text-gray-400 text-sm mb-6">
                  Preencha os dados abaixo para registrar um novo ticket na plataforma.
                </p>

                <form onSubmit={handleSubmit(handleCreate)} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nome do cliente *
                    </label>
                    <input
                      type="text"
                      {...register("clientName")}
                      placeholder="Nome da pessoa ou empresa que está solicitando o suporte"
                      className="w-full pl-4 pr-10 py-2.5 bg-[#F6F8FC1A] border border-gray-600/50 rounded-[30px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                    />
                    {errors.clientName && (
                      <p className="mt-1 text-sm text-red-400">{errors.clientName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="E-mail de contato para atualizações e resposta"
                      className="w-full pl-4 pr-10 py-2.5 bg-[#F6F8FC1A] border border-gray-600/50 rounded-[30px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Prioridade *
                      </label>
                      <select
                        {...register("priority")}
                        className="w-full pl-4 pr-10 py-2.5 bg-[#0B1125] border border-gray-600/50 rounded-[30px] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 cursor-pointer appearance-none"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239CA3AF' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 1rem center',
                          paddingRight: '2.5rem',
                        }}
                      >
                        <option value="" className="bg-[#0B1125] text-white">Selecione o nível de urgência do atendimento</option>
                        <option value="Urgente" className="bg-[#0B1125] text-white">Urgente</option>
                        <option value="Média" className="bg-[#0B1125] text-white">Média</option>
                        <option value="Baixa" className="bg-[#0B1125] text-white">Baixa</option>
                      </select>
                      {errors.priority && (
                        <p className="mt-1 text-sm text-red-400">{errors.priority.message}</p>
                      )}
                    </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Responsável *
                    </label>
                    <input
                      type="text"
                      {...register("responsible")}
                      placeholder="Quem será o responsável por esse ticket"
                      className="w-full pl-4 pr-10 py-2.5 bg-[#F6F8FC1A] border border-gray-600/50 rounded-[30px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                    />
                    {errors.responsible && (
                      <p className="mt-1 text-sm text-red-400">{errors.responsible.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Assunto *
                    </label>
                    <textarea
                      {...register("subject")}
                      rows={4}
                      placeholder="Resumo breve do problema ou solicitação"
                      className="w-full pl-4 pr-10 py-2.5 bg-[#F6F8FC1A] border border-gray-600/50 rounded-[30px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-400">{errors.subject.message}</p>
                    )}
                  </div>

                  <div className="flex justify-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        reset();
                      }}
                      className="px-6 py-2.5 border border-gray-600/50 hover:bg-gray-600/80 text-white rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
}

