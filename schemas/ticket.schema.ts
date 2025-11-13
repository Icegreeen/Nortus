import { z } from "zod";

export const ticketSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  status: z.enum(["open", "in_progress", "resolved", "closed"]),
  priority: z.enum(["urgent", "medium", "low"]),
  assignedTo: z.string().optional(),
});

export type TicketFormData = z.infer<typeof ticketSchema>;

