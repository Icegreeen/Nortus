"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Ticket, TicketResumo, TicketManagementResponse } from "@/types";
import { ticketsAPI } from "@/lib/tickets";
import { toast } from "sonner";

interface TicketsContextType {
  tickets: Ticket[];
  resumo: TicketResumo | null;
  loading: boolean;
  fetchTickets: () => Promise<void>;
  createTicket: (ticket: {
    clientName: string;
    email: string;
    priority: "Urgente" | "Média" | "Baixa";
    responsible: string;
    subject: string;
  }) => Promise<void>;
  filteredTickets: Ticket[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: {
    status?: string;
    priority?: string;
    responsible?: string;
  };
  setFilters: (filters: TicketsContextType["filters"]) => void;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

export function TicketsProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [resumo, setResumo] = useState<TicketResumo | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<TicketsContextType["filters"]>({});

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data: TicketManagementResponse = await ticketsAPI.getTicketManagement();
      setTickets(data.tickets || []);
      setResumo(data.resumo || null);
    } catch (error) {
      toast.error("Erro ao carregar tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const createTicket = async (ticket: {
    clientName: string;
    email: string;
    priority: "Urgente" | "Média" | "Baixa";
    responsible: string;
    subject: string;
  }) => {
    try {
      const newTicket = await ticketsAPI.create(ticket);
      setTickets((prev) => [newTicket, ...prev]);
      if (resumo) {
        setResumo({
          ...resumo,
          open: resumo.open + 1,
        });
      }
      toast.success("Ticket criado com sucesso!", {
        description: "O ticket foi criado e já está na sua lista.",
      });
    } catch (error) {
      toast.error("Erro ao criar ticket");
      throw error;
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !ticket.id.toLowerCase().includes(query) &&
        !ticket.client.toLowerCase().includes(query) &&
        !ticket.subject.toLowerCase().includes(query) &&
        !ticket.email.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    if (filters.status && ticket.status !== filters.status) return false;
    if (filters.priority && ticket.priority !== filters.priority) return false;
    if (filters.responsible && ticket.responsible !== filters.responsible) return false;
    return true;
  });

  return (
    <TicketsContext.Provider
      value={{
        tickets,
        resumo,
        loading,
        fetchTickets,
        createTicket,
        filteredTickets,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
      }}
    >
      {children}
    </TicketsContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketsContext);
  if (context === undefined) {
    throw new Error("useTickets must be used within a TicketsProvider");
  }
  return context;
}

