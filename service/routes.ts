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
    GETROLESPORTALBY: "/api/backend/organization/roles/by-portal",
    GETALLROLES: "/api/backend/organization/roles/all",
    GETROLEBYID: "/api/backend/organization/roles",
    DELETEROLE: "/api/backend/organization/roles/delete_role",

    ADDMEMBER: "/api/backend/organization/member/add",
    EDITMEMBER: "/api/backend/organization/member/update",
    GETALLMEMBER: "/api/backend/organization/member/all",
    GETMEMBERBYID: "/api/backend/organization/member",
    DELETEMEMBER: "/api/backend/organization/member/delete",
  },
  PERMISSIONS: {
    PERMISSIONSTEMPLATE: "/api/backend/permissions/template",
  },
};
