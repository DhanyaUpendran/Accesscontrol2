import express from "express";
import auth from "../middleware/auth.js";
import checkAccess from "../middleware/checkAccess.js";
import { PERMISSIONS } from "../utils/permission.js";

import {
  createRole,
  assignPermissionsToRole,
  assignRoleToUser,
  createTeam,
  assignUserToTeam,
  getAuditLogs
} from "../controllers/admin.controller.js";

const router = express.Router();

/* ROLES */
router.post(
  "/roles",
  auth,
  checkAccess(PERMISSIONS.MANAGE_ROLES),
  createRole
);

router.put(
  "/roles/:roleId/permissions",
  auth,
  checkAccess(PERMISSIONS.MANAGE_ROLES),
  assignPermissionsToRole
);

/* USERS */
router.post(
  "/roles/assign-user",
  auth,
  checkAccess(PERMISSIONS.MANAGE_USERS),
  assignRoleToUser
);

/* TEAMS */
router.post(
  "/teams",
  auth,
  checkAccess(PERMISSIONS.MANAGE_TEAMS),
  createTeam
);

router.post(
  "/teams/assign-user",
  auth,
  checkAccess(PERMISSIONS.MANAGE_TEAMS),
  assignUserToTeam
);


router.get(
  "/audit-logs",
  auth,
  checkAccess(PERMISSIONS.VIEW_AUDIT_LOGS),
  getAuditLogs
);
export default router;
