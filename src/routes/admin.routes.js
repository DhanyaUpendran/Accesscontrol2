import express from "express";
import auth from "../middleware/auth.js";
import checkAccess from "../middleware/checkAccess.js";
import { PERMISSIONS } from "../utils/permission.js";

import express from "express";
import {
  createUser,
  createRole,
  assignPermissionsToRole,
  assignRoleToUser,
  createTeam,
  assignUserToTeam,
  getAuditLogs,
} from "../controller/admin.controller.js";


const router = express.Router();

// ------------------ ROLES ------------------
// Create a role
router.post(
  "/roles",
  auth,
  checkAccess(PERMISSIONS.MANAGE_USERS),
  createRole
);

// Assign permissions to a role
router.put(
  "/roles/:roleId/permissions",
  auth,
  checkAccess(PERMISSIONS.MANAGE_USERS),
  assignPermissionsToRole
);

// ------------------ USERS ------------------
// Create a new user (with roles, permissions, team, time-based assignments)
router.post(
  "/users",
  auth,
  checkAccess(PERMISSIONS.MANAGE_USERS),
  createUser
);

// Assign role to an existing user (supports startsAt/endsAt)
router.post(
  "/users/assign-role",
  auth,
  checkAccess(PERMISSIONS.MANAGE_USERS),
  assignRoleToUser
);

// ------------------ TEAMS ------------------
// Create a new team
router.post(
  "/teams",
  auth,
  checkAccess(PERMISSIONS.MANAGE_USERS),
  createTeam
);

// Assign a user to a team
router.post(
  "/teams/assign-user",
  auth,
  checkAccess(PERMISSIONS.MANAGE_USERS),
  assignUserToTeam
);

// ------------------ AUDIT LOGS ------------------
// View audit logs (admin only)
router.get(
  "/audit-logs",
  auth,
  checkAccess(PERMISSIONS.VIEW_AUDIT_LOGS),
  getAuditLogs
);

export default router;
