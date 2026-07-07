// ==================================================== CLASS ===========================================

export interface ADDCLASSPAYLOAD {
  className: string;
  sections: string[];
}

export interface ClassData {
  [key: string]: unknown;
  id: string;
  schoolId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  sections: Section[];
}

export interface Section {
  id: string;
  classId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ADDCLASSRESPONSE {
  success: boolean;
  message: string;
  data: ClassData;
}

// ---- Edit (rename) class + sync sections ----
// classId comes from the URL param (PUT /:classId), not the body.

export interface EditSectionInput {
  id?: string; // present -> rename existing section, absent -> create new
  name: string;
}

export interface EDITCLASSPAYLOAD {
  className: string;
  sections?: EditSectionInput[]; // omit entirely to leave sections untouched
}

export interface EDITCLASSRESPONSE {
  success: boolean;
  message: string;
  data: ClassData;
}

export interface SectionInput {
  id?: string; // present = existing section (rename/keep), absent = new section (create)
  name: string;
}

// ---- Get all classes ----

export interface GETALLCLASSRESPONSE {
  success: boolean;
  count: number;
  data: ClassData[];
}

// ---- Get single class by id ----

export interface GETCLASSIDRESPONSE {
  success: boolean;
  data: ClassData;
}

// ---- Get classes for dropdown ----

export interface ClassDropdownItem {
  id: string;
  name: string;
}

export interface GETCLASSDROPDOWNRESPONSE {
  success: boolean;
  data: ClassDropdownItem[];
}

// ---- Delete class ----
// classId comes from the URL param (DELETE /:classId) — no body payload needed.

export interface DELETECLASSRESPONSE {
  success: boolean;
  message: string;
}

//---------------------------------------------------------Subject----------------------------------------------------

export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
  count?: number;
}

// Base Subject shape (BigInt fields are serialized to string by serializeBigInt)
export interface Subject {
  id: string;
  schoolId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// 1. CREATE SUBJECT — POST /subjects
// ============================================

export interface CreateSubjectPayload {
  name: string;
}

export type CreateSubjectResponse = ApiSuccessResponse<Subject>;

// ============================================
// 2. GET ALL SUBJECTS — GET /subjects
// ============================================

// No payload (schoolId comes from auth context)
export type GetAllSubjectsPayload = void;

export interface TeacherRef {
  id: string;
  fullName: string;
}

export interface ClassRef {
  id: string;
  name: string;
}

export interface SectionRef {
  id: string;
  name: string;
}

export interface TeacherAssignment {
  id: string;
  schoolId: string;
  subjectId: string;
  teacherId: string;
  classId: string;
  sectionId: string;
  // ...add any other TeacherAssignment scalar fields from your schema
  teacher: TeacherRef;
  class: ClassRef;
  section: SectionRef;
}

export interface SubjectWithAssignments extends Subject {
  [key: string]: unknown;
  teacherAssignments: TeacherAssignment[];
}

export type GetAllSubjectsResponse = ApiSuccessResponse<
  SubjectWithAssignments[]
>;

// ============================================
// 3. GET SUBJECTS FOR DROPDOWN — GET /subjects/dropdown
// ============================================

export type GetSubjectsForDropdownPayload = void;

export interface SubjectDropdownItem {
  id: string;
  name: string;
}

export type GetSubjectsForDropdownResponse = ApiSuccessResponse<
  SubjectDropdownItem[]
>;

// ============================================
// 4. GET SUBJECT By Id — GET /subjects/:id
// ============================================

export type GetSubjectByIdResponse = ApiSuccessResponse<SubjectWithAssignments>;

// ============================================
// 4. UPDATE SUBJECT — PATCH /subjects
// ============================================

export interface UpdateSubjectPayload {
  oldName: string;
  newName: string;
}

export type UpdateSubjectResponse = ApiSuccessResponse<Subject>;

// ============================================
// 5. DELETE SUBJECT — DELETE /subjects
// ============================================

export interface DeleteSubjectPayload {
  name: string;
}

export interface DeleteSubjectResult {
  deleted: true;
}

export type DeleteSubjectResponse = ApiSuccessResponse<DeleteSubjectResult>;

//---------------------------------------------------------Student----------------------------------------------------

// =============================================================================
// SHARED
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}

export interface DropdownOption {
  label: string;
  value: string; // bigint serialized as string over JSON
}

// =============================================================================
// CLASS
// =============================================================================

export interface Section {
  id: string;
  name: string;
  classId: string;
}

export interface ClassWithSections {
  id: string;
  schoolId: string;
  name: string;
  sections: Section[];
}

// ---- Create Class ----
export interface CreateClassPayload {
  className: string;
  sections: string[]; // plain names only
}
export type CreateClassResponse = ApiResponse<ClassWithSections>;

// ---- Get All Classes ----
export type GetAllClassesResponse = ApiResponse<ClassWithSections[]>;

// ---- Get Class By Id ----
export type GetClassByIdResponse = ApiResponse<ClassWithSections>;

// ---- Get Classes Dropdown ----
export type GetClassesDropdownResponse = ApiResponse<DropdownOption[]>;

// ---- Get Sections Dropdown (scoped to a classId) ----
export type GetSectionsDropdownResponse = ApiResponse<DropdownOption[]>;

// ---- Update Class (rename + sync sections) ----
export interface SectionInputPayload {
  id?: string; // present => update existing, absent => create new
  name: string;
}
export interface UpdateClassPayload {
  className: string;
  sections?: SectionInputPayload[]; // omit entirely to skip touching sections
}
export type UpdateClassResponse = ApiResponse<ClassWithSections>;

// ---- Delete Class ----
export type DeleteClassResponse =
  | ApiResponse<{ deleted: boolean }>
  | {
      success: boolean;
      message: string;
    };

// =============================================================================
// STUDENT ENROLLMENT
// =============================================================================

// ---- Student-specific field errors used by forms like EditStudent ----
export type StudentFieldErrors = {
  classId?: string;
  sectionId?: string;
  [key: string]: string | undefined;
};

// Generic field-errors mapping used across management hooks and forms
export type FieldErrors = Record<string, string>;

// Flat student record — matches your Prisma `User` model fields.
// Used for students NOT yet enrolled anywhere (the "available students"
// dropdown in AddStudent.tsx).
export interface Student {
  id: string;
  fullName: string; // renamed from `name` to match Prisma User.fullName
  email?: string;
  phoneNumber?: string;
}

// ---- Get Available Students ----
export type GetAvailableStudentsResponse = ApiResponse<Student[]>;

// A StudentEnrollment row with student/class/section joined in — this is
// what the enrolled-students table (StudentList.tsx) actually needs to
// render "Name / Email / Phone / Class / Section" columns and to delete
// by { studentId, classId }.
//
// ⚠️ Inferred from schema.prisma — confirm this matches your actual
// getAllStudents() service's Prisma `select`/`include` shape.
export interface EnrolledStudent {
  [key: string]: unknown;
  id: string;
  studentId: string;
  classId: string;
  sectionId: string;
  student: {
    fullName: string;
    email: string;
    phoneNumber: string | null;
  };
  class: {
    name: string;
  };
  section: {
    name: string;
  };
}

// ---- Get Enrolled Students ----
export type GetEnrolledStudentsResponse = ApiResponse<EnrolledStudent[]>;

// ---- Enroll Student ----
export interface EnrollStudentPayload {
  studentId: string;
  classId: string;
  sectionId: string;
}
export interface EnrollStudentResult {
  id: string;
  studentId: string;
  classId: string;
  sectionId: string;
}
export type EnrollStudentResponse = ApiResponse<EnrollStudentResult>;

export interface UpdateEnrollmentPayload {
  studentId: string;
  currentClassId: string;
  newClassId: string;
  newSectionId: string;
}

export interface UpdateEnrollmentResponse {
  success: boolean;
  message: string;
  data: {
    // whatever shape your serialized enrollment has
    id: string;
    studentId: string;
    classId: string;
    sectionId: string;
    schoolId: string;
    student: { id: string; fullName: string; email: string };
    class: { id: string; name: string };
    section: { id: string; name: string };
  };
}

// ---- Unenroll Student ----
export interface UnenrollStudentPayload {
  studentId: string;
  classId: string;
}
export type UnenrollStudentResponse = {
  success: boolean;
  message: string;
};

// NOTE: `Status` and form-schema inferred types should live in UI or validation files
// to avoid circular imports. See `types/ui.ts` and `features/management/validation.ts`.

// Re-export AddClass form data inferred from validation schema
import type { AddClassFormData as _AddClassFormData } from "@/features/management/validation";
export type AddClassFormData = _AddClassFormData;

// =============================================================================
// CLASS TEACHER ASSIGNMENT
// =============================================================================

// Base ClassTeacher entity shape
export interface ClassTeacher {
  id: string;
  schoolId: string;
  teacherId: string;
  classId: string;
  sectionId: string;
  createdAt: string;
  updatedAt: string;
}

// With joined teacher/class/section info for display
export interface ClassTeacherWithDetails extends ClassTeacher {
  [key: string]: unknown;
  teacher?: TeacherRef;
  class?: ClassRef;
  section?: SectionRef;
}

// ---- Get All Class Teachers ----
export type GetAllClassTeachersResponse = ApiResponse<
  ClassTeacherWithDetails[]
>;

// ---- Get Class Teacher By Id ----
export type GetClassTeacherByIdResponse = ApiResponse<ClassTeacherWithDetails>;

// ---- Get Class Teacher By Section ----
export type GetClassTeacherBySectionResponse =
  ApiResponse<ClassTeacherWithDetails>;

// ---- Assign Class Teacher ----
export interface AssignClassTeacherPayload {
  teacherId: string | number;
  classId: string | number;
  sectionId: string | number;
}
export type AssignClassTeacherResponse = ApiResponse<ClassTeacher>;

// ---- Update Class Teacher ----
export interface UpdateClassTeacherPayload {
  teacherId: string | number;
  classId: string | number;
  sectionId: string | number;
}
export type UpdateClassTeacherResponse = ApiResponse<ClassTeacher>;

// ---- Unassign Class Teacher ----
export type UnassignClassTeacherResponse = {
  success: boolean;
  message?: string;
};

// =============================================================================
// SUBJECT TEACHER ASSIGNMENT
// =============================================================================

// Base SubjectTeacher entity shape
export interface SubjectTeacher {
  id: string;
  schoolId: string;
  teacherId: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  createdAt: string;
  updatedAt: string;
}

// With joined teacher/class/section/subject info for display
export interface SubjectTeacherWithDetails extends SubjectTeacher {
  [key: string]: unknown;
  teacher?: TeacherRef;
  class?: ClassRef;
  section?: SectionRef;
  subject?: SubjectDropdownItem;
}

// ---- Get All Subject Teachers ----
export type GetAllSubjectTeachersResponse = ApiResponse<
  SubjectTeacherWithDetails[]
>;

// ---- Get Subject Teacher By Id ----
export type GetSubjectTeacherByIdResponse =
  ApiResponse<SubjectTeacherWithDetails>;

// ---- Get Subject Teachers By Section ----
export type GetSubjectTeachersBySectionResponse = ApiResponse<
  SubjectTeacherWithDetails[]
>;

// ---- Assign Subject Teacher ----
export interface AssignSubjectTeacherPayload {
  teacherId: string | number;
  classId: string | number;
  sectionId: string | number;
  subjectId: string | number;
}
export type AssignSubjectTeacherResponse = ApiResponse<SubjectTeacher>;

// ---- Update Subject Teacher ----
export interface UpdateSubjectTeacherPayload {
  teacherId: string | number;
  classId: string | number;
  sectionId: string | number;
  subjectId: string | number;
}
export type UpdateSubjectTeacherResponse = ApiResponse<SubjectTeacher>;

// ---- Unassign Subject Teacher ----
export interface UnassignSubjectTeacherPayload {
  teacherId: string | number;
  classId: string | number;
  sectionId: string | number;
  subjectId: string | number;
}
export type UnassignSubjectTeacherResponse = {
  success: boolean;
  message?: string;
};
