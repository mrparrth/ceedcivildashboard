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
  { type: "divider", auth: authRoles.admin },
  { label: "External", type: "label" },
  {
    name: "Pole Barn Form",
    icon: "launch",
    type: "extLink",
    path: "https://script.google.com/macros/s/AKfycbwlMhk694ZaK0lvZ-QK_CRzBmAYCpLru11AcS3cxV42B5Qt3lANM0kARfFbAdv6xdi--A/exec"
  },
  {
    name: "A Frame Form",
    icon: "launch",
    type: "extLink",
    path: "https://script.google.com/macros/s/AKfycbx4Gx__TTGsrecDH2O8567811P72n942pRPlLrYbbMXK3Ng7HXzqKdqenUxdGsb6tOGGg/exec"
  },
  {
    name: "New Request/ Bug Report",
    icon: "launch",
    type: "extLink",
    path: "https://forms.blue.cc/f/jj548m56r5o5iy0c73j8haay"
  },
  {
    name: "Backend Google Sheet",
    icon: "launch",
    type: "extLink",
    path: "https://docs.google.com/spreadsheets/d/1URKG0G1KP9YqlR6DX4kyQ18Jgd1yIRDdGmPdzcTjWpc/edit?gid=1757567131#gid=1757567131",
    auth: authRoles.admin
  }
];

// ,
//   { type: "divider" },
//   {
//     name: "Logout",
//     icon: "exit_to_app",
//     path: "/logout",
//     type: "logout",
//   },
