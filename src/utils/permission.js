export const PERMISSIONS = {
  VIEW_USERS: "view_users",
  MANAGE_USERS: "manage_users",
  VIEW_AUDIT_LOGS: "view_audit_logs",
  VIEW_PROFILE: "view_profile",
  UPDATE_PROFILE: "update_profile"
};

export const SCOPES = {
  SELF: "self",     // Only affects own user data
  TEAM: "team",     // Users in the same team
  GLOBAL: "global"  // Any user in the system
};
