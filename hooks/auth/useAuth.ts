import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/service/auth";
import {
  LoginPayload,
  RegisterPayload,
  OtpPayload,
} from "@/types/auth";

// ---------------- REGISTER ----------------
export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterPayload) => authApi.register(data),
  });
};

// ---------------- LOGIN ----------------
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

// ---------------- VERIFY OTP ----------------
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: OtpPayload) => authApi.verifyOtp(data),
  });
};

// ---------------- RESEND OTP ----------------
export const useResendOtp = () => {
  return useMutation({
    mutationFn: (data: OtpPayload) => authApi.resendOtp(data),
  });
};

// ---------------- ME ----------------
export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: authApi.me,
    retry: false,
  });
};

// ---------------- LOGOUT ----------------
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,

    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["me"] });
    },
  });
};