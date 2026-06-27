"use client";

import { useQuery } from "@tanstack/react-query";
import { permissionsApi } from "@/service/permissions";

export const useGetPermissionTemplate = (portalType: string | null) => {
  return useQuery({
    queryKey: ["permissions-template", portalType],
    queryFn: () => permissionsApi.getTemplate(portalType!),
    enabled: !!portalType,
    staleTime: 1000 * 60 * 5,
  });
};
