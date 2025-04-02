import { authRoles } from "./contexts/auth/authRoles";

export const getNavigations = (appData) => [
  { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
  { name: "Archived", path: "/archived", icon: "archive" },
  { name: "Finances", path: "/finance", icon: "local_atm" },
  { type: "divider" },
  { label: "Contract Generation", type: "label", auth: authRoles.admin },
  {
    name: "Form",
    path: "/contract-generator-tool",
    icon: "post_add",
    auth: authRoles.admin
  },
  {
    name: "Folder",
    icon: "snippet_folder",
    type: "extLink",
    path: appData.contractExportFolder,
    auth: authRoles.admin
  },
  {
    name: "Template",
    icon: "task",
    type: "extLink",
    path: appData.contractTemplate,
    auth: authRoles.admin
  },
  { type: "divider", auth: authRoles.admin }
];

// ,
//   { type: "divider" },
//   {
//     name: "Logout",
//     icon: "exit_to_app",
//     path: "/logout",
//     type: "logout",
//   },
