"use client";

import {
  CreateAcademicYearPayload,
  UpdateAcademicYearPayload,
  CreateAcademicYearResponse,
  GetAcademicYearsResponse,
  GetActiveAcademicYearResponse,
  GetAcademicYearByIdResponse,
  UpdateAcademicYearResponse,
  ActivateAcademicYearResponse,
  DeleteAcademicYearResponse,
} from "@/types/academic";
import { apiClient } from "./client";
import { API_ENDPOINTS } from "./routes";

export const academicApi = {
  AddAcademicYear: (data: CreateAcademicYearPayload) =>
    apiClient
      .post<CreateAcademicYearResponse>(
        API_ENDPOINTS.Academic.ADDACADEMICYEAR,
        data,
      )
      .then((res) => res.data),

  GetAllAcademicYears: () =>
    apiClient
      .get<GetAcademicYearsResponse>(API_ENDPOINTS.Academic.GETALLACADEMICYEARS)
      .then((res) => res.data),

  GetActiveAcademicYear: () =>
    apiClient
      .get<GetActiveAcademicYearResponse>(
        API_ENDPOINTS.Academic.GETACTIVEACADEMICYEAR,
      )
      .then((res) => res.data),

  GetAcademicYearById: (id: string) =>
    apiClient
      .get<GetAcademicYearByIdResponse>(
        `${API_ENDPOINTS.Academic.GETACADEMICYEARBYID}/${id}`,
      )
      .then((res) => res.data),

  EditAcademicYear: (id: string, data: UpdateAcademicYearPayload) =>
    apiClient
      .put<UpdateAcademicYearResponse>(
        `${API_ENDPOINTS.Academic.EDITACADEMICYEAR}/${id}`,
        data,
      )
      .then((res) => res.data),

  ActivateAcademicYear: (id: string) =>
    apiClient
      .patch<ActivateAcademicYearResponse>(
        `${API_ENDPOINTS.Academic.ACTIVATEACADEMICYEAR}/${id}/activate`,
      )
      .then((res) => res.data),

  DeleteAcademicYear: (id: string) =>
    apiClient
      .delete<DeleteAcademicYearResponse>(
        `${API_ENDPOINTS.Academic.DELETEACADEMICYEAR}/${id}`,
      )
      .then((res) => res.data),
};
