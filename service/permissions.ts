"use client";

import { PermissionResponse } from "@/types/permissions";
import { apiClient } from "./client";
import { API_ENDPOINTS } from "./routes";

export const permissionsApi = {
  getTemplate: (portalType: string) =>
    apiClient
      .get<PermissionResponse>(API_ENDPOINTS.PERMISSIONS.PERMISSIONSTEMPLATE, {
        params: { portalType },
      })
      .then((res) => res.data),
};
