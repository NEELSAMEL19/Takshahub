import {
  GetStudentsAttendanceParams,
  GetStudentsAttendanceResponse,
  UpdateStudentAttendancePayload,
  UpdateStudentAttendanceResponse,
  GetTeachersAttendanceParams,
  GetTeachersAttendanceResponse,
  UpdateTeacherAttendancePayload,
  UpdateTeacherAttendanceResponse,
} from "@/types/attendance";
import { apiClient } from "./client";
import { API_ENDPOINTS } from "./routes";

export const attendanceApi = {
  // -------------------------------- STUDENT ATTENDANCE ---------------------------------------

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

  // -------------------------------- TEACHER ATTENDANCE ---------------------------------------

  GetTeachersAttendance: (params: GetTeachersAttendanceParams) =>
    apiClient
      .get<GetTeachersAttendanceResponse>(
        API_ENDPOINTS.Attendance.GETTEACHERSATTENDANCE,
        { params },
      )
      .then((res) => res.data),

  UpdateTeacherAttendance: (data: UpdateTeacherAttendancePayload) =>
    apiClient
      .put<UpdateTeacherAttendanceResponse>(
        API_ENDPOINTS.Attendance.UPDATETEACHERATTENDANCE,
        data,
      )
      .then((res) => res.data),
};
