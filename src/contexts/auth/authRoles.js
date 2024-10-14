export const authRoles = {
  admin: ["ADMIN"], // Only Super Admin has access
  employee: ["ADMIN", "EMPLOYEE"], // Only SA & Admin has access
  aframeClient: ["ADMIN", "EMPLOYEE", "AFRAME"], // Only SA & Admin & Editor has access
};
