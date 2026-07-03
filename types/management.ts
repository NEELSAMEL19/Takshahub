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
  [key: string]: any;
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
