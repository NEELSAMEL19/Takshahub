"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attendanceApi } from "@/service/attendance";
import {
  GetStudentsAttendanceParams,
  UpdateStudentAttendancePayload,
  FieldErrors,
} from "@/types/attendance";
import { handleError, handleSuccess } from "@/utils/toast";

// ---------------- GET STUDENTS ATTENDANCE (roster + status) ----------------
export const useGetStudentsAttendance = (
  params: GetStudentsAttendanceParams,
) => {
  return useQuery({
    queryKey: ["attendance", params.classId, params.sectionId, params.date],
    queryFn: () => attendanceApi.GetStudentsAttendance(params),
    enabled: !!params.date,
    staleTime: 1000 * 30,
  });
};

// ---------------- TOGGLE / UPSERT STUDENT ATTENDANCE ----------------
export const useUpdateStudentAttendance = (
  onFieldError?: (errors: FieldErrors) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateStudentAttendancePayload) =>
      attendanceApi.UpdateStudentAttendance(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Attendance updated");
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },

    onError: (error) => {
      handleError(error, "Failed to update attendance", onFieldError);
    },
  });
};
