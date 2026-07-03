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
