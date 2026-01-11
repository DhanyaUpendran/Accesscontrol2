import express from "express";
import auth from "../middleware/auth.js";
import checkAccess from "../middleware/checkAccess.js";
import { PERMISSIONS } from "../utils/permission.js";
import User from "../models/user.js";

import {
  getUsers,
  updateUser,
  removeUserFromTeam
} from "../controllers/user.controller.js";

const router = express.Router();

/**
 * GET USERS
 */
router.get(
  "/users",
  auth,
  checkAccess(PERMISSIONS.VIEW_USERS),
  getUsers
);

/**
 * UPDATE USER
 */
router.put(
  "/users/:id",
  auth,
  checkAccess(
    PERMISSIONS.MANAGE_USERS,
    async (req) => {
      const user = await User.findById(req.params.id);
      req.targetUser = user;
      return user;
    }
  ),
  updateUser
);

/**
 * REMOVE USER FROM TEAM
 */
router.delete(
  "/users/:id/team",
  auth,
  checkAccess(
    PERMISSIONS.MANAGE_USERS,
    async (req) => {
      const user = await User.findById(req.params.id);
      req.targetUser = user;
      return user;
    }
  ),
  removeUserFromTeam
);

export default router;
