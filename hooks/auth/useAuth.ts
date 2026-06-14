import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "@/service/auth";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";
import { handleError, handleSuccess } from "@/utils/toast";

type FieldErrors = Record<string, string>;

// ---------------- REGISTER ----------------
export const useRegister = (onFieldError?: (errors: FieldErrors) => void) => {
  return useMutation({
    mutationFn: (data: RegisterPayload) => authApi.register(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Register successful");
    },

    onError: (error) => {
      handleError(error, "Registration failed", onFieldError);
    },
  });
};

export const useLogin = (onFieldError?: (errors: FieldErrors) => void) => {
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

// ---------------- ME ----------------
export const useMe = () => {
  return useQuery<AuthResponse>({
    queryKey: ["me"],
    queryFn: authApi.me,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};
