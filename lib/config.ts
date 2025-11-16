export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://loomi.s3.us-east-1.amazonaws.com/mock-api-json/v2";

export const AUTH = {
  cookieTokenKey: "auth_token",
};


