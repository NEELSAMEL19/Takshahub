"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { organizationApi } from "@/service/organization";
import {
  AddMemberPayload,
  DeleteMemberPayload,
  EditMemberPayload,
} from "@/types/organzation";
import { handleError, handleSuccess } from "@/utils/toast";

import type { FieldErrors } from "@/types/management";

// ---------------- ADD MEMBER ----------------
export const useAddMember = (onFieldError?: (errors: FieldErrors) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddMemberPayload) => organizationApi.AddMember(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Member added successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },

    onError: (error) => {
      handleError(error, "Failed to add member", onFieldError);
    },
  });
};

// ---------------- EDIT MEMBER ----------------
export const useEditMember = (onFieldError?: (errors: FieldErrors) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditMemberPayload) => organizationApi.EditMember(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Member updated successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },

    onError: (error) => {
      handleError(error, "Failed to update member", onFieldError);
    },
  });
};

// ---------------- GET ALL MEMBERS ----------------
export const useGetAllMembers = () => {
  return useQuery({
    queryKey: ["members"],
    queryFn: organizationApi.GetAllMembers,
    staleTime: 1000 * 60 * 5,
  });
};

// ---------------- GET MEMBER BY ID ----------------
export const useGetMemberById = (id: string) => {
  return useQuery({
    queryKey: ["member", id],
    queryFn: () => organizationApi.GetMemberById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// ---------------- DELETE MEMBER ----------------
export const useDeleteMember = (
  onFieldError?: (errors: FieldErrors) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteMemberPayload) =>
      organizationApi.DeleteMember(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Member deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },

    onError: (error) => {
      handleError(error, "Failed to delete member", onFieldError);
    },
  });
};
