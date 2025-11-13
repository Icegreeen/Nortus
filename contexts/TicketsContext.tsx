"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Ticket } from "@/types";
import { ticketsAPI } from "@/lib/api";
import { toast } from "sonner";

interface TicketsContextType {
  tickets: Ticket[];
  loading: boolean;
  fetchTickets: () => Promise<void>;
  createTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTicket: (id: string, ticket: Partial<Ticket>) => Promise<void>;
  filteredTickets: Ticket[];
  filters: {
    status?: string;
    priority?: string;
    assignedTo?: string;
  };
  setFilters: (filters: TicketsContextType["filters"]) => void;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

export function TicketsProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<TicketsContextType["filters"]>({});

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await ticketsAPI.getAll();
      setTickets(data);
    } catch (error) {
      toast.error("Erro ao carregar tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const createTicket = async (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newTicket = await ticketsAPI.create(ticket);
      setTickets((prev) => [...prev, newTicket]);
      toast.success("Ticket criado com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar ticket");
      throw error;
    }
  };

  const updateTicket = async (id: string, ticket: Partial<Ticket>) => {
    try {
      const updated = await ticketsAPI.update(id, ticket);
      setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success("Ticket atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar ticket");
      throw error;
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filters.status && ticket.status !== filters.status) return false;
    if (filters.priority && ticket.priority !== filters.priority) return false;
    if (filters.assignedTo && ticket.assignedTo !== filters.assignedTo) return false;
    return true;
  });

  return (
    <TicketsContext.Provider
      value={{
        tickets,
        loading,
        fetchTickets,
        createTicket,
        updateTicket,
        filteredTickets,
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

