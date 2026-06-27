"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { organizationApi } from "@/service/organization";
import { handleError, handleSuccess } from "@/utils/toast";
import { AddRolePayload, EditRolePayload } from "@/types/organzation";

type FieldErrors = Record<string, string>;

// ---------------- ADD ROLE ----------------
export const useAddRole = (onFieldError?: (errors: FieldErrors) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddRolePayload) => organizationApi.AddRole(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Role added successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },

    onError: (error) => {
      handleError(error, "Failed to add role", onFieldError);
    },
  });
};

// ---------------- EDIT ROLE ----------------
export const useEditRole = (onFieldError?: (errors: FieldErrors) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EditRolePayload) => organizationApi.EditRole(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },

    onError: (error) => {
      handleError(error, "Failed to update role", onFieldError);
    },
  });
};

// ---------------- GET ALL ROLES ----------------
export const useGetAllRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: organizationApi.GetAllRoles,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetRolesByPortal = (portalType: string | null) => {
  return useQuery({
    queryKey: ["roles", "portal", portalType],
    queryFn: () => organizationApi.getRolesPortalBy(portalType!),
    enabled: !!portalType,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetRoleById = (id: string) => {
  return useQuery({
    queryKey: ["role", id],
    queryFn: () => organizationApi.GetRoleById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// ---------------- DELETE ROLE ----------------
export const useDeleteRole = (onFieldError?: (errors: FieldErrors) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: organizationApi.DeleteRole,

    onSuccess: (response) => {
      handleSuccess(response.message, "Role deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },

    onError: (error) => {
      handleError(error, "Failed to delete role", onFieldError);
    },
  });
};
