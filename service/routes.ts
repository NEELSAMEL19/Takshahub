export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://takshahub.onrender.com";

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
  ORGANIZATION: {
    ADDROLE: "/api/backend/organization/roles/create_role",
    EDITROLE: "/api/backend/organization/roles/update_role",
    GETROLE: "/api/backend/organization/roles", 
    GETALLROLES: "/api/backend/organization/roles/all",
    DELETEROLE: "/api/backend/organization/roles/delete_role",
  },
  PERMISSIONS: {
    PERMISSIONSTEMPLATE: "/api/backend/permissions/template",
  },
};
