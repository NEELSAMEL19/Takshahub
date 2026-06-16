"use client";

import { apiClient } from "./client";
import { API_ENDPOINTS } from "./routes";
import { SideMenuResponse } from "@/types/sideMenu";

export const sideMenuApi = {
  adminMenu: () => apiClient.get<SideMenuResponse>(API_ENDPOINTS.SIDEMENU.ADMINMENU),

  teacherMenu: () =>
    apiClient.get<SideMenuResponse>(API_ENDPOINTS.SIDEMENU.TEACHERMENU),

  studentMenu: () =>
    apiClient.get<SideMenuResponse>(API_ENDPOINTS.SIDEMENU.STUDENTMENU),
};