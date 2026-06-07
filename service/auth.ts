"use client";

import { apiClient } from "./client";
import { API_ENDPOINTS } from "./routes";
import {
  AuthResponse, 
  LoginPayload,
  OtpPayload,
  RegisterPayload,
} from "@/types/auth";

export const authApi = {
  register: (payload: RegisterPayload): Promise<AuthResponse> =>
    apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload),

  login: (payload: LoginPayload): Promise<AuthResponse> =>
    apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload),

  verifyOtp: (payload: OtpPayload): Promise<AuthResponse> =>
    apiClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, payload),

  resendOtp: (payload: OtpPayload): Promise<AuthResponse> =>
    apiClient.post(API_ENDPOINTS.AUTH.RESEND_OTP, payload),

  me: (): Promise<AuthResponse> =>
    apiClient.get(API_ENDPOINTS.AUTH.ME),

  logout: (): Promise<{ success: boolean }> =>
    apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),
};
