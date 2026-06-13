"use client";

import { ApiClient, apiClient } from "./client";
import { API_BASE_URL, API_ENDPOINTS } from "./routes";
import {
  AuthResponse,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  ResendOtpPayload,
  ResendOtpResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "@/types/auth";

const getFrontendApiClient = () => {
  const baseUrl =
    typeof window === "undefined" ? API_BASE_URL : window.location.origin;

  return new ApiClient(baseUrl);
};

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, payload),

  login: (payload: LoginPayload) =>
    getFrontendApiClient().post<LoginResponse>("/api/auth/login", payload),

  resendOtp: (payload: ResendOtpPayload) =>
    apiClient.post<ResendOtpResponse>(API_ENDPOINTS.AUTH.RESEND_OTP, payload),

  verifyOtp: (payload: VerifyOtpPayload) =>
    apiClient.post<VerifyOtpResponse>(API_ENDPOINTS.AUTH.VERIFY_OTP, payload),

  me: () => apiClient.get<AuthResponse>(API_ENDPOINTS.AUTH.ME),
};
