"use client";

import {
  AddEditRoleResponse,
  DeleteRoleResponse,
  GetAllRolesResponse,
  RoleWithPermissions,
} from "@/types/organzation";
import { Permission } from "@/types/permissions";
import { apiClient } from "./client";
import { API_ENDPOINTS } from "./routes";

export interface AddRolePayload {
  name: string;
  portalType: string;
  permissions: Permission[];
}

export interface EditRolePayload {
  oldName: string;
  newName: string;
  portalType: string;
  permissions: Permission[];
}

export const organizationApi = {
  AddRole: (data: AddRolePayload) =>
    apiClient
      .post<AddEditRoleResponse>(API_ENDPOINTS.ORGANIZATION.ADDROLE, data)
      .then((res) => res.data),

  EditRole: (data: EditRolePayload) =>
    apiClient
      .put<AddEditRoleResponse>(API_ENDPOINTS.ORGANIZATION.EDITROLE, data)
      .then((res) => res.data),
  GetRoleById: (id: string) =>
    apiClient
      .get<{
        success: boolean;
        data: RoleWithPermissions;
      }>(`${API_ENDPOINTS.ORGANIZATION.GETROLE}/${id}`)
      .then((res) => res.data),
  GetAllRoles: () =>
    apiClient
      .get<GetAllRolesResponse>(API_ENDPOINTS.ORGANIZATION.GETALLROLES)
      .then((res) => res.data),

  DeleteRole: (data: { name: string; portalType: string }) =>
    apiClient
      .delete<DeleteRoleResponse>(API_ENDPOINTS.ORGANIZATION.DELETEROLE, {
        data,
      })
      .then((res) => res.data),
};
