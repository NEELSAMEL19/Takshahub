// ==================== ROLE ====================

export interface Permission {
  id: string;
  module: string;
  feature: string;
  portalType: string;
  label: string;
  order: number;
  createdAt: string;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  updatedAt: string;
  updatedBy: string;
  permission: Permission;
}

export interface AddUpdateRolePermission {
  module: string;
  feature: string;
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface Role {
  [key: string]: unknown;
  id: string;
  schoolId: string;
  name: string;
  portalType: string;
  createdAt: string;
  updatedAt: string;
}

// Canonical portal type used across organization feature
export type PortalType = "ADMIN" | "STAFF" | "TEACHER" | "STUDENT";

export interface AddRolePayload {
  name: string;
  portalType: string;
  permissions: AddUpdateRolePermission[];
}

export interface EditRolePayload {
  oldName: string;
  newName: string;
  oldPortalType: string;
  newPortalType: string;
  permissions: AddUpdateRolePermission[];
}

export interface RoleWithPermissions extends Role {
  permissions: RolePermission[];
}

export interface AddEditRoleResponse {
  success: boolean;
  message: string;
  data: RoleWithPermissions;
}

export interface RoleOption {
  label: string;
  value: string;
}

export interface GetRolesByPortalResponse {
  success: boolean;
  data: RoleOption[];
}

export type EditRoleResponse = AddEditRoleResponse;

export interface GetAllRolesResponse {
  success: boolean;
  count: number;
  data: Role[];
}

export interface DeleteRoleResponse {
  success: boolean;
  message: string;
}

// ==================== MEMBER ====================

export interface MemberRole {
  name: string;
  portalType: string;
}

export interface MemberData {
  [key: string]: unknown;
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  schoolId: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role: MemberRole;
}

export interface AddMemberPayload {
  fullName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  portalType: string;
  roleName: string;
}

export interface EditMemberPayload extends AddMemberPayload {
  id: string;
}

export interface DeleteMemberPayload {
  email: string;
}

export interface AddMemberResponse {
  success: boolean;
  message: string;
  data: MemberData;
}

export type EditMemberResponse = AddMemberResponse;

export interface GetMemberByIdResponse {
  success: boolean;
  data: MemberData;
}

export interface GetAllMembersResponse {
  success: boolean;
  count: number;
  data: MemberData[];
}

export interface DeleteMemberResponse {
  success: boolean;
  message: string;
}

// Re-export validation-inferred types from feature schemas
import type {
  AddMemberFormData as _AddMemberFormData,
  AddRoleFormData as _AddRoleFormData,
} from "@/features/organization/validation";
export type AddMemberFormData = _AddMemberFormData;
export type AddRoleFormData = _AddRoleFormData;
