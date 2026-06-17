"use client";

import { apiClient } from "./client";
import { API_ENDPOINTS } from "./routes";
import { SideMenuResponse } from "@/types/sideMenu";

export const sideMenuApi = {
  adminMenu: () =>
    apiClient.get<SideMenuResponse>(API_ENDPOINTS.SIDEMENU.ADMINMENU).then((res) => res.data),

  teacherMenu: () =>
    apiClient.get<SideMenuResponse>(API_ENDPOINTS.SIDEMENU.TEACHERMENU).then((res) => res.data),

  studentMenu: () =>
    apiClient.get<SideMenuResponse>(API_ENDPOINTS.SIDEMENU.STUDENTMENU).then((res) => res.data),
};