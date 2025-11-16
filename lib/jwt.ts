export function parseJwtPayload<T = Record<string, unknown>>(token: string): T | null {
  try {
    const [, payloadPart] = token.split(".");
    if (!payloadPart) return null;
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = decodeBase64(normalized);
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
}

function decodeBase64(value: string): string {
  if (typeof window !== "undefined" && typeof window.atob === "function") {
    return window.atob(value);
  }
  const g: any = globalThis as any;
  if (g?.Buffer) {
    return g.Buffer.from(value, "base64").toString("utf8");
  }
  return "";
}


