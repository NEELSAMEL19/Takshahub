"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/service/setting";
import { UpdateProfilePayload } from "@/types/setting";
import { handleError, handleSuccess } from "@/utils/toast";

import type { FieldErrors } from "@/types/management";

// ---------------- GET PROFILE ----------------
export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: profileApi.GetProfile,
    staleTime: 1000 * 60 * 5,
  });
};

// ---------------- UPDATE PROFILE ----------------
export const useUpdateProfile = (
  onFieldError?: (errors: FieldErrors) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => profileApi.UpdateProfile(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },

    onError: (error) => {
      handleError(error, "Failed to update profile", onFieldError);
    },
  });
};
