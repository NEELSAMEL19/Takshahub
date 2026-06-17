export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://takshahub.onrender.com";

export const SERVER_API_BASE_URL =
  process.env.API_BASE_URL ?? "https://takshahub.onrender.com";

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/backend/auth/register",
    LOGIN: "/api/backend/auth/login",
    ME: "/api/backend/auth/me",
    LOGOUT: "/api/backend/auth/logout",
  },
  SIDEMENU: {
    ADMINMENU: "/api/backend/sidebar",
    TEACHERMENU: "/api/backend/sidebar/teacher",
    STUDENTMENU: "/api/backend/sidebar/student",
  },
};