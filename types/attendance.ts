export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export type FieldErrors = Record<string, string>;

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
