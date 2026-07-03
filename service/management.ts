import {
  ADDCLASSPAYLOAD,
  ADDCLASSRESPONSE,
  EDITCLASSPAYLOAD,
  EDITCLASSRESPONSE,
  GETALLCLASSRESPONSE,
  GETCLASSIDRESPONSE,
  GETCLASSDROPDOWNRESPONSE,
  DELETECLASSRESPONSE,
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
};
