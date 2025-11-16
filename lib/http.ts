import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL, AUTH } from "./config";

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = Cookies.get(AUTH.cookieTokenKey);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;


