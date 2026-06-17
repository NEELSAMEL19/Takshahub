import axios, { type AxiosInstance } from "axios";
import { API_BASE_URL } from "./routes";

export type ApiClient = AxiosInstance;

export const apiClient: ApiClient = axios.create({
  baseURL: typeof window !== "undefined" ? "" : API_BASE_URL,
  withCredentials: true,
  timeout: 60000,
});