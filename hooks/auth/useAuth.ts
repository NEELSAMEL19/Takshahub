import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

// ---------------- LOGIN ----------------
export const useLogin = (onFieldError?: (errors: FieldErrors) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),

    onSuccess: async (response: LoginResponse) => {
      handleSuccess(response.message, "Login successful");

      // Clear previous logged-in user's cached data
      queryClient.removeQueries({
        queryKey: ["me"],
      });

      queryClient.removeQueries({
        queryKey: ["sideMenu"],
      });

      // Fetch new logged-in user
      await queryClient.invalidateQueries({
        queryKey: ["me"],
      });

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

    // Auth data should always be fresh
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
};
