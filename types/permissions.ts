export type AllowedAction = "canRead" | "canCreate" | "canUpdate" | "canDelete";

export interface PermissionFeature {
  id: string;
  name: string;
  allowedActions: AllowedAction[];
}

export interface PermissionModule {
  id: string;
  name: string;
  features: PermissionFeature[];
}

export interface PermissionResponse {
  code: number;
  message: string;
  data: PermissionModule[];
}

export type Permission = {
  module: string;
  feature: string;
  canRead?: boolean;
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
};
