import {
  GetStudentsAttendanceParams,
  GetStudentsAttendanceResponse,
  UpdateStudentAttendancePayload,
  UpdateStudentAttendanceResponse,
} from "@/types/attendance";
import { apiClient } from "./client";
import { API_ENDPOINTS } from "./routes";

export const attendanceApi = {
  // -------------------------------- ATTENDANCE ---------------------------------------

  GetStudentsAttendance: (params: GetStudentsAttendanceParams) =>
    apiClient
      .get<GetStudentsAttendanceResponse>(
        API_ENDPOINTS.Attendance.GETSTUDENTSATTENDANCE,
        { params },
      )
      .then((res) => res.data),

  UpdateStudentAttendance: (data: UpdateStudentAttendancePayload) =>
    apiClient
      .put<UpdateStudentAttendanceResponse>(
        API_ENDPOINTS.Attendance.UPDATESTUDENTATTENDANCE,
        data,
      )
      .then((res) => res.data),
};
