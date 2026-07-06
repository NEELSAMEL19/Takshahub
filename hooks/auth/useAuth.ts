import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "@/service/auth";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  LoginResponse,
} from "@/types/auth";
import { handleError, handleSuccess } from "@/utils/toast";

import type { FieldErrors } from "@/types/management";

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

    onSuccess: (response: LoginResponse) => {
      handleSuccess(response.message, "Login successful");
      return response;
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
