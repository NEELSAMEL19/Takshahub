// ==================== PROFILE ====================

export interface ProfileRole {
  name: string;
  portalType: string;
}

export interface ProfileData {
  [key: string]: unknown;
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  schoolId: string;
  roleId: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role: ProfileRole;
}

export interface UpdateProfilePayload {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface GetProfileResponse {
  success: boolean;
  data: ProfileData;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: ProfileData;
}
