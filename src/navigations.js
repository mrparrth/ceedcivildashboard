import { PERMISSIONS } from "./contexts/auth/authRoles";

export const getNavigations = (appData) => [
  { name: "Dashboard", path: "/dashboard", icon: "dashboard", requiredPermission: PERMISSIONS.projects },
  { name: "Archived", path: "/archived", icon: "archive", requiredPermission: PERMISSIONS.projects },
  { name: "Finances", path: "/finance", icon: "local_atm", requiredPermission: PERMISSIONS.finance },
  { type: "divider" },
  { label: "Contract Generation", type: "label", requiredPermission: PERMISSIONS.forms },
  {
    name: "Form",
    path: "/contract-generator-tool",
    icon: "post_add",
    requiredPermission: PERMISSIONS.forms,
  },
  {
    name: "Folder",
    icon: "snippet_folder",
    type: "extLink",
    path: appData.contractExportFolder,
    requiredPermission: PERMISSIONS.forms,
  },
  {
    name: "Template",
    icon: "task",
    type: "extLink",
    path: appData.contractTemplate,
    requiredPermission: PERMISSIONS.forms,
  },
  { type: "divider", requiredPermission: PERMISSIONS.forms },
];

// ,
//   { type: "divider" },
//   {
//     name: "Logout",
//     icon: "exit_to_app",
//     path: "/logout",
//     type: "logout",
//   },
