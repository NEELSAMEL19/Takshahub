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

export interface AddEditRoleResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    schoolId: string;
    name: string;
    portalType: string;
    createdAt: string;
    updatedAt: string;
    permissions: RolePermission[];
  };
}

export interface EditRoleResponse {
  success: boolean;
  message: string;
  data: Role;
}
export interface Role {
  id: string;
  schoolId: string;
  name: string;
  portalType: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllRolesResponse {
  success: boolean;
  count: number;
  data: Role[];
}

export interface DeleteRoleResponse {
  success: boolean;
  message: string;
}

export interface RoleWithPermissions {
  id: string;
  schoolId: string;
  name: string;
  portalType: string;
  createdAt: string;
  updatedAt: string;
  permissions: RolePermission[];
}
