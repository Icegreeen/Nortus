import http from "./http";
import { API_BASE_URL } from "./config";
import { parseJwtPayload } from "./jwt";
import { LoginCredentials, AuthResponse, User } from "@/types";

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await http.get(`${API_BASE_URL}/login.json`);
    const { data } = response.data as { data: { accessToken: string; username: string } };

    const token = data.accessToken;
    if (!token) {
      throw new Error("Não foi possível recuperar o token de acesso");
    }

    const payload = parseJwtPayload<{
      sub?: string;
      username?: string;
      email?: string;
      role?: User["role"];
    }>(token);

    const identifiers = [
      payload?.email?.toLowerCase(),
      payload?.username?.toLowerCase(),
      data.username?.toLowerCase(),
    ].filter(Boolean) as string[];

    const normalizedInput = credentials.email.trim().toLowerCase();
    const isIdentifierValid = identifiers.includes(normalizedInput);

    const expectedPassword = payload?.sub || "nortus123";
    const isPasswordValid = credentials.password === expectedPassword;

    if (!isIdentifierValid || !isPasswordValid) {
      throw new Error("Credenciais inválidas");
    }

    const user: User = {
      id: payload?.sub || Date.now().toString(),
      name: data.username || payload?.username || "Operador Nortus",
      email: payload?.email || credentials.email,
      role: payload?.role || "operator",
    };

    return {
      token,
      user,
    };
  },
};


