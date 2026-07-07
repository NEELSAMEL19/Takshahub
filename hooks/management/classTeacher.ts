"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { managementApi } from "@/service/management";
import {
  AssignClassTeacherPayload,
  UpdateClassTeacherPayload,
  FieldErrors,
} from "@/types/management";
import { handleError, handleSuccess } from "@/utils/toast";

// ============================================
// ASSIGN CLASS TEACHER
// ============================================
export const useAssignClassTeacher = (
  onFieldError?: (errors: FieldErrors) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignClassTeacherPayload) =>
      managementApi.AssignClassTeacher(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Class teacher assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["classTeachers"] });
    },

    onError: (error) => {
      handleError(error, "Failed to assign class teacher", onFieldError);
    },
  });
};

// ============================================
// UPDATE CLASS TEACHER
// ============================================
export const useUpdateClassTeacher = (
  onFieldError?: (errors: FieldErrors) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateClassTeacherPayload;
    }) => managementApi.UpdateClassTeacher(id, data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Class teacher updated successfully");
      queryClient.invalidateQueries({ queryKey: ["classTeachers"] });
    },

    onError: (error) => {
      handleError(error, "Failed to update class teacher", onFieldError);
    },
  });
};

// ============================================
// GET ALL CLASS TEACHERS
// ============================================
export const useGetAllClassTeachers = () => {
  return useQuery({
    queryKey: ["classTeachers"],
    queryFn: managementApi.GetAllClassTeachers,
    staleTime: 1000 * 60 * 5,
  });
};

// ============================================
// GET CLASS TEACHER BY ID
// ============================================
export const useGetClassTeacherById = (id: string) => {
  return useQuery({
    queryKey: ["classTeacher", id],
    queryFn: () => managementApi.GetClassTeacherById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// ============================================
// GET CLASS TEACHER BY SECTION
// ============================================
export const useGetClassTeacherBySection = (sectionId: string) => {
  return useQuery({
    queryKey: ["classTeacher", "section", sectionId],
    queryFn: () => managementApi.GetClassTeacherBySection(sectionId),
    enabled: !!sectionId,
    staleTime: 1000 * 60 * 5,
  });
};

// ============================================
// UNASSIGN CLASS TEACHER
// ============================================
export const useUnassignClassTeacher = (
  onFieldError?: (errors: FieldErrors) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sectionId: string) =>
      managementApi.UnassignClassTeacher(sectionId),

    onSuccess: (response) => {
      handleSuccess(response.message, "Class teacher unassigned successfully");
      queryClient.invalidateQueries({ queryKey: ["classTeachers"] });
    },

    onError: (error) => {
      handleError(error, "Failed to unassign class teacher", onFieldError);
    },
  });
};
