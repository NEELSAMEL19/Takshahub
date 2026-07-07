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
  MANAGEMENT: {
    CREATECLASS: "/api/backend/management/class/create",
    GETALLCLASS: "/api/backend/management/class/all",
    GETCLASSDROPDOWN: "/api/backend/management/class/class-dropdown",
    GETSECTIONDROPDOWN: "/api/backend/management/class/section-dropdown",
    EDITCLASS: "/api/backend/management/class",
    GETCLASSBYID: "/api/backend/management/class",
    DELETECLASS: "/api/backend/management/class",

    ADDSUBJECT: "/api/backend/management/subject/create",
    GETALLSUBJECTS: "/api/backend/management/subject/all",
    GETSUBJECTSDROPDOWN: "/api/backend/management/subject/dropdown",
    EDITSUBJECT: "/api/backend/management/subject/update",
    GETSUBJECTBYID: "/api/backend/management/subject",
    DELETESUBJECT: "/api/backend/management/subject/delete",

    ADDSTUDENT: "/api/backend/management/students/enroll",
    EDITSTUDENTS: "/api/backend/management/students/enroll",
    GETALLSTUDENTS: "/api/backend/management/students/enrolled",
    GETSTUDENTBYID: "/api/backend/management/students/enrolled",
    GETAVAILABLESTUDENTS: "/api/backend/management/students/available",
    DELETESTUDENT: "/api/backend/management/students/unenroll",

    GETALLCLASSTEACHERS: "/api/backend/management/class_teacher",
    GETCLASSTEACHERBYID: "/api/backend/management/class_teacher",
    GETCLASSTEACHERBYSECTION: "/api/backend/management/class_teacher/section",
    ASSIGNCLASSTEACHER: "/api/backend/management/class_teacher/assign",
    UPDATECLASSTEACHER: "/api/backend/management/class_teacher",
    UNASSIGNCLASSTEACHER: "/api/backend/management/class_teacher/unassign",

    GETALLSUBJECTTEACHERS: "/api/backend/management/subject_teacher",
    GETSUBJECTTEACHERBYID: "/api/backend/management/subject_teacher",
    GETSUBJECTTEACHERSBYSECTION: "/api/backend/management/subject_teacher/section",
    ASSIGNSUBJECTTEACHER: "/api/backend/management/subject_teacher/assign",
    UPDATESUBJECTTEACHER: "/api/backend/management/subject_teacher",
    UNASSIGNSUBJECTTEACHER: "/api/backend/management/subject_teacher/unassign",
  },
  PERMISSIONS: {
    PERMISSIONSTEMPLATE: "/api/backend/permissions/template",
  },
};
