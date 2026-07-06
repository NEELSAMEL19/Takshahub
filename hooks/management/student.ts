"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { managementApi } from "@/service/management";
import {
  EnrollStudentPayload,
  UnenrollStudentPayload,
  UpdateEnrollmentPayload,
  FieldErrors,
} from "@/types/management";
import { handleError, handleSuccess } from "@/utils/toast";

// ---------------- ENROLL STUDENT ----------------
export const useAddStudent = (onFieldError?: (errors: FieldErrors) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EnrollStudentPayload) => managementApi.AddStudent(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Student enrolled successfully");
      queryClient.invalidateQueries({ queryKey: ["students", "enrolled"] });
      queryClient.invalidateQueries({ queryKey: ["students", "available"] });
    },

    onError: (error) => {
      handleError(error, "Failed to enroll student", onFieldError);
    },
  });
};

// ---------------- UPDATE STUDENT ENROLLMENT ----------------
export const useEditStudent = (
  onFieldError?: (errors: FieldErrors) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateEnrollmentPayload) =>
      managementApi.EditStudent(data),

    onSuccess: (response) => {
      handleSuccess(
        response.message,
        "Student enrollment updated successfully",
      );
      queryClient.invalidateQueries({ queryKey: ["students", "enrolled"] });
      queryClient.invalidateQueries({ queryKey: ["students", "available"] });
    },

    onError: (error) => {
      handleError(error, "Failed to update student enrollment", onFieldError);
    },
  });
};

// ---------------- GET ENROLLED STUDENTS ----------------
export const useGetAllStudents = () => {
  return useQuery({
    queryKey: ["students", "enrolled"],
    queryFn: managementApi.GetAllStudents,
    staleTime: 1000 * 60 * 5,
  });
};

// ---------------- GET ENROLLED BY ID ----------------
export const useGetStudentById = (id: string) => {
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => managementApi.GetStudentById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// ---------------- GET AVAILABLE STUDENTS ----------------
export const useGetAvailableStudents = () => {
  return useQuery({
    queryKey: ["students", "available"],
    queryFn: managementApi.GetAvailableStudents,
    staleTime: 1000 * 60 * 5,
  });
};

// ---------------- UNENROLL STUDENT ----------------
export const useDeleteStudent = (
  onFieldError?: (errors: FieldErrors) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UnenrollStudentPayload) =>
      managementApi.DeleteStudent(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Student unenrolled successfully");
      queryClient.invalidateQueries({ queryKey: ["students", "enrolled"] });
      queryClient.invalidateQueries({ queryKey: ["students", "available"] });
    },

    onError: (error) => {
      handleError(error, "Failed to unenroll student", onFieldError);
    },
  });
};
