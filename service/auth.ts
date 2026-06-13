"use client";

import { apiClient } from "./client";
import { API_ENDPOINTS } from "./routes";
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

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, payload),

  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload),

  resendOtp: (payload: ResendOtpPayload) =>
    apiClient.post<ResendOtpResponse>(API_ENDPOINTS.AUTH.RESEND_OTP, payload),

  verifyOtp: (payload: VerifyOtpPayload) =>
    apiClient.post<VerifyOtpResponse>(API_ENDPOINTS.AUTH.VERIFY_OTP, payload),

  me: () => apiClient.get<AuthResponse>(API_ENDPOINTS.AUTH.ME),
};
