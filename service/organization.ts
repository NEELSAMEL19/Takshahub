"use client";

import {
  AddEditRoleResponse,
  AddMemberPayload,
  AddMemberResponse,
  AddRolePayload,
  DeleteMemberPayload,
  DeleteMemberResponse,
  DeleteRoleResponse,
  EditMemberPayload,
  EditMemberResponse,
  EditRolePayload,
  EditRoleResponse,
  GetAllMembersResponse,
  GetAllRolesResponse,
  GetMemberByIdResponse,
  GetRolesByPortalResponse,
  RoleWithPermissions,
} from "@/types/organzation";
import { apiClient } from "./client";
import { API_ENDPOINTS } from "./routes";

export const organizationApi = {
  AddRole: (data: AddRolePayload) =>
    apiClient
      .post<AddEditRoleResponse>(API_ENDPOINTS.ORGANIZATION.ADDROLE, data)
      .then((res) => res.data),

  EditRole: (data: EditRolePayload) =>
    apiClient
      .put<EditRoleResponse>(API_ENDPOINTS.ORGANIZATION.EDITROLE, data)
      .then((res) => res.data),
  GetAllRoles: () =>
    apiClient
      .get<GetAllRolesResponse>(API_ENDPOINTS.ORGANIZATION.GETALLROLES)
      .then((res) => res.data),
  getRolesPortalBy: (portalType: string) =>
    apiClient
      .get<GetRolesByPortalResponse>(API_ENDPOINTS.ORGANIZATION.GETROLESPORTALBY, {
        params: { portalType },
      })
      .then((res) => res.data),
  GetRoleById: (id: string) =>
    apiClient
      .get<{
        success: boolean;
        data: RoleWithPermissions;
      }>(`${API_ENDPOINTS.ORGANIZATION.GETROLEBYID}/${id}`)
      .then((res) => res.data),
  DeleteRole: (data: { name: string; portalType: string }) =>
    apiClient
      .delete<DeleteRoleResponse>(API_ENDPOINTS.ORGANIZATION.DELETEROLE, {
        data,
      })
      .then((res) => res.data),

  AddMember: (data: AddMemberPayload) =>
    apiClient
      .post<AddMemberResponse>(API_ENDPOINTS.ORGANIZATION.ADDMEMBER, data)
      .then((res) => res.data),

  EditMember: (data: EditMemberPayload) =>
    apiClient
      .put<EditMemberResponse>(API_ENDPOINTS.ORGANIZATION.EDITMEMBER, data)
      .then((res) => res.data),
  GetAllMembers: () =>
    apiClient
      .get<GetAllMembersResponse>(API_ENDPOINTS.ORGANIZATION.GETALLMEMBER)
      .then((res) => res.data),
  GetMemberById: (id: string) =>
    apiClient
      .get<GetMemberByIdResponse>(
        `${API_ENDPOINTS.ORGANIZATION.GETMEMBERBYID}/${id}`,
      )
      .then((res) => res.data),
  DeleteMember: (data: DeleteMemberPayload) =>
    apiClient
      .delete<DeleteMemberResponse>(API_ENDPOINTS.ORGANIZATION.DELETEMEMBER, {
        data,
      })
      .then((res) => res.data),
};
