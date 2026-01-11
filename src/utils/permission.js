export const PERMISSIONS = {
  VIEW_USERS: "VIEW_USERS",
  MANAGE_USERS: "MANAGE_USERS",
  MANAGE_ROLES: "MANAGE_ROLES",
  MANAGE_TEAMS: "MANAGE_TEAMS",
  VIEW_AUDIT_LOGS: "VIEW_AUDIT_LOGS"
};


export const SCOPES = {
  SELF: "self",     // Only affects own user data
  TEAM: "team",     // Users in the same team
  GLOBAL: "global"  // Any user in the system
};
