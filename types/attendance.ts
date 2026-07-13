export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export type FieldErrors = Record<string, string>;

// ==================== Student ====================

export interface AttendanceStudent {
  studentId: string;
  fullName: string;
  email: string;
  status: AttendanceStatus | null;
}

export interface GetStudentsAttendanceParams {
  classId: string;
  sectionId: string;
  date: string; // "YYYY-MM-DD"
  academicYearId: string;
}

export interface GetStudentsAttendanceResponse {
  message: string;
  data: AttendanceStudent[];
}

export interface UpdateStudentAttendancePayload {
  studentId: string;
  classId: string;
  sectionId: string;
  date: string; // "YYYY-MM-DD"
  status: AttendanceStatus | null; // null = unmark
}

export interface UpdateStudentAttendanceResult {
  id?: string;
  studentId: string;
  classId: string;
  sectionId: string;
  schoolId?: string;
  date: string;
  status: AttendanceStatus | null;
}

export interface UpdateStudentAttendanceResponse {
  message: string;
  data: UpdateStudentAttendanceResult;
}

// ==================== Teacher ====================

export interface AttendanceTeacher {
  teacherId: string;
  fullName: string;
  email: string;
  status: AttendanceStatus | null;
}

export interface GetTeachersAttendanceParams {
  date: string; // "YYYY-MM-DD"
  academicYearId: string;
}

export interface GetTeachersAttendanceResponse {
  message: string;
  data: AttendanceTeacher[];
}

export interface UpdateTeacherAttendancePayload {
  teacherId: string;
  date: string; // "YYYY-MM-DD"
  status: AttendanceStatus | null; // null = unmark
}

export interface UpdateTeacherAttendanceResult {
  id?: string;
  teacherId: string;
  schoolId?: string;
  date: string;
  status: AttendanceStatus | null;
}

export interface UpdateTeacherAttendanceResponse {
  message: string;
  data: UpdateTeacherAttendanceResult;
}
