"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { managementApi } from "@/service/management";
import {
  CreateSubjectPayload,
  UpdateSubjectPayload,
  DeleteSubjectPayload,
} from "@/types/management";
import { handleError, handleSuccess } from "@/utils/toast";

type FieldErrors = Record<string, string>;

// ---------------- ADD SUBJECT ----------------
export const useAddSubject = (onFieldError?: (errors: FieldErrors) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubjectPayload) => managementApi.AddSubject(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Subject added successfully");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },

    onError: (error) => {
      handleError(error, "Failed to add subject", onFieldError);
    },
  });
};

// ---------------- EDIT SUBJECT ----------------
export const useEditSubject = (
  onFieldError?: (errors: FieldErrors) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSubjectPayload) => managementApi.EditSubject(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Subject updated successfully");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },

    onError: (error) => {
      handleError(error, "Failed to update subject", onFieldError);
    },
  });
};

// ---------------- GET ALL SUBJECTS ----------------
export const useGetAllSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: managementApi.GetAllSubjects,
    staleTime: 1000 * 60 * 5,
  });
};

// ---------------- GET SUBJECT BY ID ----------------
export const useGetSubjectById = (id: string) => {
  return useQuery({
    queryKey: ["subject", id],
    queryFn: () => managementApi.GetSubjectById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// ---------------- GET SUBJECT DROPDOWN ----------------
export const useGetSubjectDropdown = () => {
  return useQuery({
    queryKey: ["subjects", "dropdown"],
    queryFn: managementApi.GetSubjectDropdown,
    staleTime: 1000 * 60 * 5,
  });
};

// ---------------- DELETE SUBJECT ----------------
export const useDeleteSubject = (
  onFieldError?: (errors: FieldErrors) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteSubjectPayload) =>
      managementApi.DeleteSubject(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Subject deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },

    onError: (error) => {
      handleError(error, "Failed to delete subject", onFieldError);
    },
  });
};
