"use client";

import { apiClient } from "./client";
import { API_ENDPOINTS } from "./routes";
import { SideMenuResponse } from "@/types/sideMenu";

export const sideMenuApi = {
  sideMenu: () =>
    apiClient
      .get<SideMenuResponse>(API_ENDPOINTS.SIDEMENU.MENU)
      .then((res) => res.data),
};
