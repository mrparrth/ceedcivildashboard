export const authRoles = {
  admin: ["SA"], // Only Super Admin has access
  employee: ["SA", "EMPLOYEE"], // Only SA & Admin has access
  aframeClient: ["SA", "EMPLOYEE", "AFRAME"], // Only SA & Admin & Editor has access
};
