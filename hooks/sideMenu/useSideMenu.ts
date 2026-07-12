import { useQuery } from "@tanstack/react-query";
import { sideMenuApi } from "@/service/sideMenu";
import type { SideMenuResponse } from "@/types/sideMenu";

export const useSideMenu = (userId?: string, enabled = true) => {
  return useQuery<SideMenuResponse>({
    queryKey: ["sideMenu", userId],
    queryFn: sideMenuApi.sideMenu,
    enabled: enabled && !!userId,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};
