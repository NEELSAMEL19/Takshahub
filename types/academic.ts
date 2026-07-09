// ==========================================
// Core Entity
// ==========================================

export type FieldErrors = Record<string, string>;

export interface AcademicYear {
  [key: string]: unknown;
  id: string; // BigInt serialized as string
  schoolId: string; // BigInt serialized as string
  label: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// ==========================================
// Request Payloads
// ==========================================

export interface CreateAcademicYearPayload {
  label: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
}

export interface UpdateAcademicYearPayload {
  label: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
}

// No payload needed for activate/delete — id comes from the URL param

// ==========================================
// Response Wrappers
// ==========================================

export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiListResponse<T> {
  success: true;
  count: number;
  data: T[];
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ==========================================
// Endpoint-specific Response Types
// ==========================================

export type CreateAcademicYearResponse = ApiSuccessResponse<AcademicYear>;

export type GetAcademicYearsResponse = ApiListResponse<AcademicYear>;

export type GetActiveAcademicYearResponse = ApiSuccessResponse<AcademicYear>;

export type GetAcademicYearByIdResponse = ApiSuccessResponse<AcademicYear>;

export type UpdateAcademicYearResponse = ApiSuccessResponse<AcademicYear>;

export type ActivateAcademicYearResponse = ApiSuccessResponse<AcademicYear>;

export interface DeleteAcademicYearResult {
  deleted: true;
}
export type DeleteAcademicYearResponse =
  ApiSuccessResponse<DeleteAcademicYearResult>;
