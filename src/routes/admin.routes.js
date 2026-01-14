import express from "express";
import { PERMISSIONS } from "../utils/constants.js";
import auth from "../middleware/auth.js";
import {access} from "../middleware/checkAccess.js"
import {
  createRole,
  assignPermissionsToRole,
  assignRoleToUser,
  createTeam,
  assignUserToTeam,
  getAuditLogs,
  createUser,
  
} from "../controller/admin.controller.js";
import Role from "../models/role.js";
import Team from "../models/team.js";
import User from "../models/user.js";

const router = express.Router();

router.get(
  "/users",
  auth,
  access(PERMISSIONS.MANAGE_USERS), // admin permission
  async (req, res) => {
    const users = await User.find().populate("team");
    res.json(users);
  }
);



router.post(
  "/users",
  auth,
  access(PERMISSIONS.MANAGE_USERS),
  createUser
);

// Role management
router.post(
  "/roles",
  auth,
  access(PERMISSIONS.MANAGE_ROLES),
  createRole
);

router.get(
  "/roles",
  auth,
  access(PERMISSIONS.MANAGE_ROLES),
  async (req, res) => {
    const roles = await Role.find();
    res.json(roles);
  }
);

router.put(
  "/roles/:roleId/permissions",
  auth,
  access(PERMISSIONS.MANAGE_ROLES),
  assignPermissionsToRole
);

router.post(
  "/roles/assign",
  auth,
  access(PERMISSIONS.MANAGE_ROLES),
  assignRoleToUser
);

// Team management
router.post(
  "/teams/create",
  auth,
  access(PERMISSIONS.MANAGE_TEAMS),
  createTeam
);

router.get(
  "/teams",
  auth,
  access(PERMISSIONS.MANAGE_TEAMS),
  async (req, res) => {
    const teams = await Team.find();
    res.json(teams);
  }
);

router.post(
  "/teams/assign",
  auth,
  access(PERMISSIONS.MANAGE_TEAMS),
  assignUserToTeam
);

// Audit logs
router.get(
  "/audit-logs",
  auth,
  access(PERMISSIONS.VIEW_AUDIT_LOGS),
  getAuditLogs
);

export default router;
