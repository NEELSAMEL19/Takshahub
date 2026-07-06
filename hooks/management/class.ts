"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { managementApi } from "@/service/management";
import { ADDCLASSPAYLOAD, EDITCLASSPAYLOAD, FieldErrors } from "@/types/management";
import { handleError, handleSuccess } from "@/utils/toast";

// ---------------- ADD CLASS ----------------
export const useAddClass = (onFieldError?: (errors: FieldErrors) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ADDCLASSPAYLOAD) => managementApi.AddClass(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Class added successfully");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },

    onError: (error) => {
      handleError(error, "Failed to add class", onFieldError);
    },
  });
};

// ---------------- EDIT CLASS ----------------
export const useEditClass = (onFieldError?: (errors: FieldErrors) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classId,
      data,
    }: {
      classId: string;
      data: EDITCLASSPAYLOAD;
    }) => managementApi.EditClass(classId, data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Class updated successfully");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },

    onError: (error) => {
      handleError(error, "Failed to update class", onFieldError);
    },
  });
};

// ---------------- GET ALL CLASSES ----------------
export const useGetAllClasses = () => {
  return useQuery({
    queryKey: ["classes"],
    queryFn: managementApi.GetAllClass,
    staleTime: 1000 * 60 * 5,
  });
};

// ---------------- GET CLASS BY ID ----------------
export const useGetClassById = (id: string) => {
  return useQuery({
    queryKey: ["class", id],
    queryFn: () => managementApi.GetClassById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// ---------------- GET CLASS DROPDOWN ----------------
export const useGetClassDropdown = () => {
  return useQuery({
    queryKey: ["classes", "dropdown"],
    queryFn: managementApi.GetClassDropdown,
    staleTime: 1000 * 60 * 5,
  });
};

// ---------------- GET CLASS DROPDOWN ----------------
export const useGetSectionDropdown = (classId: string | number | null) => {
  return useQuery({
    queryKey: ["section", "dropdown", classId],
    queryFn: () => managementApi.GetSectionDropdown(String(classId)),
    enabled: !!classId,
    staleTime: 1000 * 60 * 5,
  });
};

// ---------------- DELETE CLASS ----------------
export const useDeleteClass = (
  onFieldError?: (errors: FieldErrors) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classId: string) => managementApi.DeleteClass(classId),

    onSuccess: (response) => {
      handleSuccess(response.message, "Class deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },

    onError: (error) => {
      handleError(error, "Failed to update class", onFieldError);
    },
  });
};
