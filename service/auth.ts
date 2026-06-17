"use client";

import { apiClient } from "./client";
import { API_ENDPOINTS } from "./routes";
import {
  AuthResponse,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "@/types/auth";

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, payload).then((res) => res.data),

  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload).then((res) => res.data),

  me: () =>
    apiClient.get<AuthResponse>(API_ENDPOINTS.AUTH.ME).then((res) => res.data),
};
