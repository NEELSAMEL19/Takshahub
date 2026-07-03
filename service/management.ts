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
} from "@/types/management";
import { apiClient } from "./client";
import { API_ENDPOINTS } from "./routes";

export const managementApi = {
  // ----------------------------------------------------------------------
  // CLASS (sections are managed inline via create/edit payloads)
  // ----------------------------------------------------------------------

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

  DeleteClass: (classId: string) =>
    apiClient
      .delete<DELETECLASSRESPONSE>(
        `${API_ENDPOINTS.MANAGEMENT.DELETECLASS}/${classId}`,
      )
      .then((res) => res.data),

  // ----------------------------------------------------------------------
  // SUBJECT
  // ----------------------------------------------------------------------

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
};
