import {
  ADDCLASSPAYLOAD,
  ADDCLASSRESPONSE,
  EDITCLASSPAYLOAD,
  EDITCLASSRESPONSE,
  GETALLCLASSRESPONSE,
  GETCLASSIDRESPONSE,
  GETCLASSDROPDOWNRESPONSE,
  DELETECLASSRESPONSE,
  CreateSubjectPayload,
  CreateSubjectResponse,
  UpdateSubjectPayload,
  UpdateSubjectResponse,
  GetAllSubjectsResponse,
  GetSubjectByIdResponse,
  GetSubjectsForDropdownResponse,
  DeleteSubjectPayload,
  DeleteSubjectResponse,
  EnrollStudentPayload,
  EnrollStudentResponse,
  GetEnrolledStudentsResponse,
  GetAvailableStudentsResponse,
  UnenrollStudentPayload,
  UnenrollStudentResponse,
  UpdateEnrollmentResponse,
  UpdateEnrollmentPayload,
  AssignClassTeacherPayload,
  AssignClassTeacherResponse,
  GetAllClassTeachersResponse,
  GetClassTeacherByIdResponse,
  GetClassTeacherBySectionResponse,
  UpdateClassTeacherPayload,
  UpdateClassTeacherResponse,
  UnassignClassTeacherResponse,
  AssignSubjectTeacherPayload,
  AssignSubjectTeacherResponse,
  GetAllSubjectTeachersResponse,
  GetSubjectTeacherByIdResponse,
  GetSubjectTeachersBySectionResponse,
  UpdateSubjectTeacherPayload,
  UpdateSubjectTeacherResponse,
  UnassignSubjectTeacherPayload,
  UnassignSubjectTeacherResponse,
} from "@/types/management";
import { apiClient } from "./client";
import { API_ENDPOINTS } from "./routes";

export const managementApi = {
  // ------------------------------------------------------ CLASS -------------------------------------------

  AddClass: (data: ADDCLASSPAYLOAD) =>
    apiClient
      .post<ADDCLASSRESPONSE>(API_ENDPOINTS.MANAGEMENT.CREATECLASS, data)
      .then((res) => res.data),

  EditClass: (classId: string, data: EDITCLASSPAYLOAD) =>
    apiClient
      .put<EDITCLASSRESPONSE>(
        `${API_ENDPOINTS.MANAGEMENT.EDITCLASS}/${classId}`,
        data,
      )
      .then((res) => res.data),

  GetAllClass: () =>
    apiClient
      .get<GETALLCLASSRESPONSE>(API_ENDPOINTS.MANAGEMENT.GETALLCLASS)
      .then((res) => res.data),

  GetClassById: (id: string) =>
    apiClient
      .get<GETCLASSIDRESPONSE>(`${API_ENDPOINTS.MANAGEMENT.GETCLASSBYID}/${id}`)
      .then((res) => res.data),

  GetClassDropdown: () =>
    apiClient
      .get<GETCLASSDROPDOWNRESPONSE>(API_ENDPOINTS.MANAGEMENT.GETCLASSDROPDOWN)
      .then((res) => res.data),
  GetSectionDropdown: (classId: string) =>
    apiClient
      .get<GETCLASSDROPDOWNRESPONSE>(
        `${API_ENDPOINTS.MANAGEMENT.GETSECTIONDROPDOWN}/${classId}`,
      )
      .then((res) => res.data),
  DeleteClass: (classId: string) =>
    apiClient
      .delete<DELETECLASSRESPONSE>(
        `${API_ENDPOINTS.MANAGEMENT.DELETECLASS}/${classId}`,
      )
      .then((res) => res.data),

  // -------------------------------- SUBJECT ---------------------------------------

  AddSubject: (data: CreateSubjectPayload) =>
    apiClient
      .post<CreateSubjectResponse>(API_ENDPOINTS.MANAGEMENT.ADDSUBJECT, data)
      .then((res) => res.data),

  GetAllSubjects: () =>
    apiClient
      .get<GetAllSubjectsResponse>(API_ENDPOINTS.MANAGEMENT.GETALLSUBJECTS)
      .then((res) => res.data),

  GetSubjectDropdown: () =>
    apiClient
      .get<GetSubjectsForDropdownResponse>(
        API_ENDPOINTS.MANAGEMENT.GETSUBJECTSDROPDOWN,
      )
      .then((res) => res.data),

  GetSubjectById: (id: string) =>
    apiClient
      .get<GetSubjectByIdResponse>(
        `${API_ENDPOINTS.MANAGEMENT.GETSUBJECTBYID}/${id}`,
      )
      .then((res) => res.data),

  EditSubject: (data: UpdateSubjectPayload) =>
    apiClient
      .put<UpdateSubjectResponse>(API_ENDPOINTS.MANAGEMENT.EDITSUBJECT, data)
      .then((res) => res.data),

  DeleteSubject: (data: DeleteSubjectPayload) =>
    apiClient
      .delete<DeleteSubjectResponse>(API_ENDPOINTS.MANAGEMENT.DELETESUBJECT, {
        data,
      })
      .then((res) => res.data),

  // -------------------------------- STUDENT ---------------------------------------
  AddStudent: (data: EnrollStudentPayload) =>
    apiClient
      .post<EnrollStudentResponse>(API_ENDPOINTS.MANAGEMENT.ADDSTUDENT, data)
      .then((res) => res.data),
  EditStudent: (data: UpdateEnrollmentPayload) =>
    apiClient
      .put<UpdateEnrollmentResponse>(
        API_ENDPOINTS.MANAGEMENT.EDITSTUDENTS,
        data,
      )
      .then((res) => res.data),
  GetAllStudents: () =>
    apiClient
      .get<GetEnrolledStudentsResponse>(API_ENDPOINTS.MANAGEMENT.GETALLSTUDENTS)
      .then((res) => res.data),
  GetStudentById: (studentId: string) =>
    apiClient
      .get<GetEnrolledStudentsResponse>(
        `${API_ENDPOINTS.MANAGEMENT.GETSTUDENTBYID}/${studentId}`,
      )
      .then((res) => res.data),
  GetAvailableStudents: () =>
    apiClient
      .get<GetAvailableStudentsResponse>(
        API_ENDPOINTS.MANAGEMENT.GETAVAILABLESTUDENTS,
      )
      .then((res) => res.data),

  DeleteStudent: (data: UnenrollStudentPayload) =>
    apiClient
      .delete<UnenrollStudentResponse>(API_ENDPOINTS.MANAGEMENT.DELETESTUDENT, {
        data,
      })
      .then((res) => res.data),

  // -------------------------------- CLASS TEACHER --------------------------------
  GetAllClassTeachers: () =>
    apiClient
      .get<GetAllClassTeachersResponse>(
        API_ENDPOINTS.MANAGEMENT.GETALLCLASSTEACHERS,
      )
      .then((res) => res.data),

  GetClassTeacherById: (id: string) =>
    apiClient
      .get<GetClassTeacherByIdResponse>(
        `${API_ENDPOINTS.MANAGEMENT.GETCLASSTEACHERBYID}/${id}`,
      )
      .then((res) => res.data),

  GetClassTeacherBySection: (sectionId: string) =>
    apiClient
      .get<GetClassTeacherBySectionResponse>(
        `${API_ENDPOINTS.MANAGEMENT.GETCLASSTEACHERBYSECTION}/${sectionId}`,
      )
      .then((res) => res.data),

  AssignClassTeacher: (data: AssignClassTeacherPayload) =>
    apiClient
      .post<AssignClassTeacherResponse>(
        API_ENDPOINTS.MANAGEMENT.ASSIGNCLASSTEACHER,
        data,
      )
      .then((res) => res.data),

  UpdateClassTeacher: (id: string, data: UpdateClassTeacherPayload) =>
    apiClient
      .put<UpdateClassTeacherResponse>(
        `${API_ENDPOINTS.MANAGEMENT.UPDATECLASSTEACHER}/${id}`,
        data,
      )
      .then((res) => res.data),

  UnassignClassTeacher: (sectionId: string) =>
    apiClient
      .delete<UnassignClassTeacherResponse>(
        `${API_ENDPOINTS.MANAGEMENT.UNASSIGNCLASSTEACHER}/${sectionId}`,
      )
      .then((res) => res.data),

  // -------------------------------- SUBJECT TEACHER --------------------------------
  GetAllSubjectTeachers: () =>
    apiClient
      .get<GetAllSubjectTeachersResponse>(
        API_ENDPOINTS.MANAGEMENT.GETALLSUBJECTTEACHERS,
      )
      .then((res) => res.data),

  GetSubjectTeacherById: (id: string) =>
    apiClient
      .get<GetSubjectTeacherByIdResponse>(
        `${API_ENDPOINTS.MANAGEMENT.GETSUBJECTTEACHERBYID}/${id}`,
      )
      .then((res) => res.data),

  GetSubjectTeachersBySection: (sectionId: string) =>
    apiClient
      .get<GetSubjectTeachersBySectionResponse>(
        `${API_ENDPOINTS.MANAGEMENT.GETSUBJECTTEACHERSBYSECTION}/${sectionId}`,
      )
      .then((res) => res.data),

  AssignSubjectTeacher: (data: AssignSubjectTeacherPayload) =>
    apiClient
      .post<AssignSubjectTeacherResponse>(
        API_ENDPOINTS.MANAGEMENT.ASSIGNSUBJECTTEACHER,
        data,
      )
      .then((res) => res.data),

  UpdateSubjectTeacher: (id: string, data: UpdateSubjectTeacherPayload) =>
    apiClient
      .put<UpdateSubjectTeacherResponse>(
        `${API_ENDPOINTS.MANAGEMENT.UPDATESUBJECTTEACHER}/${id}`,
        data,
      )
      .then((res) => res.data),

  UnassignSubjectTeacher: (data: UnassignSubjectTeacherPayload) =>
    apiClient
      .delete<UnassignSubjectTeacherResponse>(
        API_ENDPOINTS.MANAGEMENT.UNASSIGNSUBJECTTEACHER,
        { data },
      )
      .then((res) => res.data),
};
