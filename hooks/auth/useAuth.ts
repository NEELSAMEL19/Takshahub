import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/service/auth";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  ResendOtpPayload,
  VerifyOtpPayload,
} from "@/types/auth";
import { handleError, handleSuccess } from "@/utils/toast";

// ---------------- REGISTER ----------------
export const useRegister = (onFieldError?: (errors: any) => void) => {
  return useMutation({
    mutationFn: (data: RegisterPayload) => authApi.register(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Otp send to your email");
    },

    onError: (error) => {
      handleError(error, "Registration failed", onFieldError);
    },
  });
};

export const useLogin = (onFieldError?: (errors: any) => void) => {
  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),

    onSuccess: async (response) => {
      handleSuccess(response.message, "Login successful");
    },

    onError: (error) => {
      handleError(error, "Login failed", onFieldError);
    },
  });
};

// ---------------- VERIFY OTP ----------------
export const useVerifyOtp = (onFieldError?: (errors: any) => void) => {
  return useMutation({
    mutationFn: (data: VerifyOtpPayload) => authApi.verifyOtp(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "OTP verified successfully");
    },

    onError: (error) => {
      handleError(error, "OTP verification failed", onFieldError);
    },
  });
};

// ---------------- RESEND OTP ----------------
export const useResendOtp = (onFieldError?: (errors: any) => void) => {
  return useMutation({
    mutationFn: (data: ResendOtpPayload) => authApi.resendOtp(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "OTP resent successfully");
    },

    onError: (error) => {
      handleError(error, "Failed to resend OTP", onFieldError);
    },
  });
};

// ---------------- ME ----------------
export const useMe = () => {
  return useQuery<AuthResponse>({
    queryKey: ["me"],
    queryFn: authApi.me,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};
