import { useQuery } from "@tanstack/react-query";
import { sideMenuApi } from "@/service/sideMenu";
import type { SideMenuResponse } from "@/types/sideMenu";

export type SideMenuRole = "admin" | "teacher" | "student";

const sideMenuQueryKeys = {
  all: ["sideMenu"] as const,
  role: (role: SideMenuRole) => [...sideMenuQueryKeys.all, role] as const,
};

const sideMenuFetchers: Record<SideMenuRole, () => Promise<SideMenuResponse>> = {
  admin: sideMenuApi.adminMenu,
  teacher: sideMenuApi.teacherMenu,
  student: sideMenuApi.studentMenu,
};

export const useAdminMenu = () => {
  return useQuery<SideMenuResponse>({
    queryKey: sideMenuQueryKeys.role("admin"),
    queryFn: sideMenuApi.adminMenu,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTeacherMenu = () => {
  return useQuery<SideMenuResponse>({
    queryKey: sideMenuQueryKeys.role("teacher"),
    queryFn: sideMenuApi.teacherMenu,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useStudentMenu = () => {
  return useQuery<SideMenuResponse>({
    queryKey: sideMenuQueryKeys.role("student"),
    queryFn: sideMenuApi.studentMenu,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSideMenu = (role: SideMenuRole, enabled = true) => {
  return useQuery<SideMenuResponse>({
    queryKey: sideMenuQueryKeys.role(role),
    queryFn: sideMenuFetchers[role],
    enabled,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};
