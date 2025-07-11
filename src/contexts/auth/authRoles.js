export const PERMISSIONS = {
  finance: "finance",
  projects: "projects",
  settings: "settings",
  profile: "profile",
  viewContacts: "viewContacts",
  adminLinks: "adminLinks",
  adminTools: "adminTools", //different tools available to admin
  forms: "forms",
};

//currently the tools available for admin are: create expenses,

export const AUTH_ROLES = {
  ADMIN: [PERMISSIONS.finance, PERMISSIONS.projects, PERMISSIONS.settings, PERMISSIONS.adminLinks, PERMISSIONS.adminTools, PERMISSIONS.forms, PERMISSIONS.viewContacts],
  EMPLOYEE: [PERMISSIONS.finance, PERMISSIONS.projects],
  AFRAME: [PERMISSIONS.finance, PERMISSIONS.projects, PERMISSIONS.profile],
  FINANCEONLY: [PERMISSIONS.finance],
  PROJECTONLY: [PERMISSIONS.projects],
};

export const authRoles = {
  admin: ["ADMIN"], // Only Super Admin has access
  employee: ["ADMIN", "EMPLOYEE"], // Only SA & Admin has access
  aframeClient: ["ADMIN", "EMPLOYEE", "AFRAME"], // Only SA & Admin & Editor has access
  financeOnly: ["FINANCEONLY"],
  projectOnly: ["PROJECTONLY"],
};
