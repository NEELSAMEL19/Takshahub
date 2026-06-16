// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.API_BASE_URL ??
  "https://takshahub.onrender.com";

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    ME: "/api/auth/me",
    LOGOUT: "/api/auth/logout",
  },
  SIDEMENU: {
    ADMINMENU: "/api/sidebar",
    TEACHERMENU: "/api/sidebar/teacher",
    STUDENTMENU: "/api/sidebar/student",
  },
};
