"use client";

import { apiClient } from "./client";
import { API_ENDPOINTS } from "./routes";
import {
  AuthResponse,
  LoginPayload,
  LoginResponse,
<<<<<<< Updated upstream
  LogoutResponse,
  RegisterPayload,
  RegisterResponse,
=======
  RegisterPayload,
  RegisterResponse,
  ResendOtpPayload,
  ResendOtpResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
>>>>>>> Stashed changes
} from "@/types/auth";

export const authApi = {
  register: (payload: RegisterPayload) =>
<<<<<<< Updated upstream
    apiClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, payload).then((res) => res.data),

  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload).then((res) => res.data),

  me: () =>
    apiClient.get<AuthResponse>(API_ENDPOINTS.AUTH.ME).then((res) => res.data),
  logout:()=>
    apiClient.post<LogoutResponse>(API_ENDPOINTS.AUTH.LOGOUT).then((res) => res.data),
=======
    apiClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, payload),

  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload),

  resendOtp: (payload: ResendOtpPayload) =>
    apiClient.post<ResendOtpResponse>(API_ENDPOINTS.AUTH.RESEND_OTP, payload),

  verifyOtp: (payload: VerifyOtpPayload) =>
    apiClient.post<VerifyOtpResponse>(API_ENDPOINTS.AUTH.VERIFY_OTP, payload),

  me: () => apiClient.get<AuthResponse>(API_ENDPOINTS.AUTH.ME),
>>>>>>> Stashed changes
};
