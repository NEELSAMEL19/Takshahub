"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attendanceApi } from "@/service/attendance";
import {
  GetTeachersAttendanceParams,
  UpdateTeacherAttendancePayload,
  FieldErrors,
} from "@/types/attendance";
import { handleError, handleSuccess } from "@/utils/toast";

// ---------------- GET TEACHERS ATTENDANCE (roster + status) ----------------
export const useGetTeachersAttendance = (
  params: GetTeachersAttendanceParams,
) => {
  return useQuery({
    queryKey: ["teacherAttendance", params.academicYearId, params.date],
    queryFn: () => attendanceApi.GetTeachersAttendance(params),
    enabled: !!params.date,
    staleTime: 1000 * 30,
  });
};

// ---------------- TOGGLE / UPSERT TEACHER ATTENDANCE ----------------
export const useUpdateTeacherAttendance = (
  onFieldError?: (errors: FieldErrors) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTeacherAttendancePayload) =>
      attendanceApi.UpdateTeacherAttendance(data),

    onSuccess: (response) => {
      handleSuccess(response.message, "Attendance updated");
      queryClient.invalidateQueries({ queryKey: ["teacherAttendance"] });
    },

    onError: (error) => {
      handleError(error, "Failed to update attendance", onFieldError);
    },
  });
};
