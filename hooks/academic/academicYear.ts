"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { academicApi } from "@/service/academic";
import {
  CreateAcademicYearPayload,
  UpdateAcademicYearPayload,
  FieldErrors,
} from "@/types/academic";
import { handleError, handleSuccess } from "@/utils/toast";

// ---------------- GET ALL ACADEMIC YEARS ----------------
export const useGetAcademicYears = () => {
  return useQuery({
    queryKey: ["academicYears"],
    queryFn: () => academicApi.GetAllAcademicYears(),
    staleTime: 1000 * 60, // 1 min
  });
};

// ---------------- GET ACTIVE ACADEMIC YEAR ----------------
export const useGetActiveAcademicYear = () => {
  return useQuery({
    queryKey: ["academicYears", "active"],
    queryFn: () => academicApi.GetActiveAcademicYear(),
    staleTime: 1000 * 60,
  });
};

// ---------------- GET ACADEMIC YEAR BY ID ----------------
export const useGetAcademicYearById = (id: string) => {
  return useQuery({
    queryKey: ["academicYears", id],
    queryFn: () => academicApi.GetAcademicYearById(id),
    enabled: !!id,
  });
};

// ---------------- CREATE ACADEMIC YEAR ----------------
export const useAddAcademicYear = (
  onFieldError?: (errors: FieldErrors) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAcademicYearPayload) =>
      academicApi.AddAcademicYear(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Academic year created");
      queryClient.invalidateQueries({ queryKey: ["academicYears"] });
    },

    onError: (error) => {
      handleError(error, "Failed to create academic year", onFieldError);
    },
  });
};

// ---------------- EDIT ACADEMIC YEAR ----------------
export const useEditAcademicYear = (
  onFieldError?: (errors: FieldErrors) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAcademicYearPayload;
    }) => academicApi.EditAcademicYear(id, data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Academic year updated");
      queryClient.invalidateQueries({ queryKey: ["academicYears"] });
    },

    onError: (error) => {
      handleError(error, "Failed to update academic year", onFieldError);
    },
  });
};

// ---------------- ACTIVATE ACADEMIC YEAR ----------------
export const useActivateAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => academicApi.ActivateAcademicYear(id),

    onSuccess: (response) => {
      handleSuccess(response.message, "Academic year activated");
      queryClient.invalidateQueries({ queryKey: ["academicYears"] });
    },

    onError: (error) => {
      handleError(error, "Failed to activate academic year");
    },
  });
};

// ---------------- DELETE ACADEMIC YEAR ----------------
export const useDeleteAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => academicApi.DeleteAcademicYear(id),

    onSuccess: (response) => {
      handleSuccess(response.message, "Academic year deleted");
      queryClient.invalidateQueries({ queryKey: ["academicYears"] });
    },

    onError: (error) => {
      handleError(error, "Failed to delete academic year");
    },
  });
};
