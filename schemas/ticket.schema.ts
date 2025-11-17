import { z } from "zod";

export const ticketSchema = z.object({
  clientName: z.string().min(1, "Nome do cliente é obrigatório"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  priority: z.enum(["Urgente", "Média", "Baixa"], {
    required_error: "Prioridade é obrigatória",
  }),
  responsible: z.string().min(1, "Responsável é obrigatório"),
  subject: z.string().min(1, "Assunto é obrigatório"),
});

export type TicketFormData = z.infer<typeof ticketSchema>;

