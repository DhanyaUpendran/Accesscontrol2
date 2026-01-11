import express from "express";
import {
  getUsers,
  getProfile,
  updateUser,
  removeUserFromTeam,
} from "../controller/user.controller.js";

import auth from "../middleware/auth.js";
import checkAccess from "../middleware/checkAccess.js";
import User from "../models/user.js";

const router = express.Router();

/**
 * Helper to get target user for scope enforcement
 */
const getTargetUser = async (req) => {
  const { userId } = req.params;
  return await User.findById(userId);
};

// 🌐 Get all allowed users (scope-aware)
router.get(
  "/",
  auth,
  checkAccess("VIEW_USERS"),
  getUsers
);

// 👤 Get current logged-in user profile
router.get("/profile", auth, checkAccess("VIEW_PROFILE"), getProfile);

// ✏️ Update a user (name/email)
router.put(
  "/:userId",
  auth,
  checkAccess("UPDATE_PROFILE", getTargetUser),
  updateUser
);

// 🏷 Remove user from team
router.delete(
  "/:userId/team",
  auth,
  checkAccess("MANAGE_USERS", getTargetUser),
  removeUserFromTeam
);

export default router;
