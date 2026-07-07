"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { managementApi } from "@/service/management";
import {
  AssignSubjectTeacherPayload,
  UpdateSubjectTeacherPayload,
  UnassignSubjectTeacherPayload,
  FieldErrors,
} from "@/types/management";
import { handleError, handleSuccess } from "@/utils/toast";

// ============================================
// ASSIGN SUBJECT TEACHER
// ============================================
export const useAssignSubjectTeacher = (
  onFieldError?: (errors: FieldErrors) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignSubjectTeacherPayload) =>
      managementApi.AssignSubjectTeacher(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Subject teacher assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["subjectTeachers"] });
    },

    onError: (error) => {
      handleError(error, "Failed to assign subject teacher", onFieldError);
    },
  });
};

// ============================================
// UPDATE SUBJECT TEACHER
// ============================================
export const useUpdateSubjectTeacher = (
  onFieldError?: (errors: FieldErrors) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSubjectTeacherPayload;
    }) => managementApi.UpdateSubjectTeacher(id, data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Subject teacher updated successfully");
      queryClient.invalidateQueries({ queryKey: ["subjectTeachers"] });
    },

    onError: (error) => {
      handleError(error, "Failed to update subject teacher", onFieldError);
    },
  });
};

// ============================================
// GET ALL SUBJECT TEACHERS
// ============================================
export const useGetAllSubjectTeachers = () => {
  return useQuery({
    queryKey: ["subjectTeachers"],
    queryFn: managementApi.GetAllSubjectTeachers,
    staleTime: 1000 * 60 * 5,
  });
};

// ============================================
// GET SUBJECT TEACHER BY ID
// ============================================
export const useGetSubjectTeacherById = (id: string) => {
  return useQuery({
    queryKey: ["subjectTeacher", id],
    queryFn: () => managementApi.GetSubjectTeacherById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// ============================================
// GET SUBJECT TEACHERS BY SECTION
// ============================================
export const useGetSubjectTeachersBySection = (sectionId: string) => {
  return useQuery({
    queryKey: ["subjectTeachers", "section", sectionId],
    queryFn: () => managementApi.GetSubjectTeachersBySection(sectionId),
    enabled: !!sectionId,
    staleTime: 1000 * 60 * 5,
  });
};

// ============================================
// UNASSIGN SUBJECT TEACHER
// ============================================
export const useUnassignSubjectTeacher = (
  onFieldError?: (errors: FieldErrors) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UnassignSubjectTeacherPayload) =>
      managementApi.UnassignSubjectTeacher(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Subject teacher unassigned successfully");
      queryClient.invalidateQueries({ queryKey: ["subjectTeachers"] });
    },

    onError: (error) => {
      handleError(error, "Failed to unassign subject teacher", onFieldError);
    },
  });
};
