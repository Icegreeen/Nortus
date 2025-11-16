import { z } from "zod";

const userIdentifierSchema = z
  .string()
  .min(1, "Usuário é obrigatório")
  .refine(
    (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(value)) return true;

      const cpfDigits = value.replace(/[^\d]/g, "");
      if (cpfDigits.length === 11 && /^\d{11}$/.test(cpfDigits)) return true;

      const passportRegex = /^[A-Za-z0-9]{6,}$/;
      if (passportRegex.test(value)) return true;

      return false;
    },
    {
      message: "Insira um email válido, CPF ou passaporte",
    }
  );

export const loginSchema = z.object({
  email: userIdentifierSchema,
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

