import { PERMISSIONS } from "../constants/permissions";

export const SIDEBAR_ITEMS = [
  {
    label: "Dashboard",
    path: "/dashboard",
    permissions: [], // always visible
  },

  {
    label: "My Profile",
    path: "/profile",
    permissions: [PERMISSIONS.VIEW_PROFILE],
  },

  {
    label: "Users",
    path: "/users",
    permissions: [PERMISSIONS.VIEW_USERS],
  },

  {
    label: "Team",
    path: "/team",
    permissions: [PERMISSIONS.VIEW_USERS],
  },

  {
    label: "Manage Users",
    path: "/admin/users",
    permissions: [PERMISSIONS.MANAGE_USERS],
  },

  {
    label: "Roles",
    path: "/admin/roles",
    permissions: [PERMISSIONS.MANAGE_USERS],
  },

  {
    label: "Audit Logs",
    path: "/admin/audit-logs",
    permissions: [PERMISSIONS.VIEW_AUDIT_LOGS],
  },
];
