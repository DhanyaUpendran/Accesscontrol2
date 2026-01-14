import express from "express";
import { PERMISSIONS } from "../utils/constants.js";
import auth from "../middleware/auth.js";
import{ access} from "../middleware/checkAccess.js"

import {
  getUsers,
  updateUser,
  removeUserFromTeam,
  getProfile
} from "../controller/user.controller.js";
import User from "../models/user.js";

const router = express.Router();

// View own profile
router.get("/profile", auth, access(PERMISSIONS.VIEW_PROFILE), getProfile);

// View allowed users (self / team / global)
router.get("/userdetails", auth, access(PERMISSIONS.VIEW_USERS), getUsers);

// Update user (name/email)
router.put(
  "/users/:userId",
  auth,
 access(PERMISSIONS.MANAGE_USERS, async (req) => {
    return await User.findById(req.params.userId);
  }),
  updateUser
);

// Remove user from team (NOT delete)
router.put(
  "/users/:userId/remove-team",
  auth,
 access(PERMISSIONS.MANAGE_USERS, async (req) => {
    return await User.findById(req.params.userId);
  }),
  removeUserFromTeam
);
router.get(
  "/team-members",
  auth,
  access(PERMISSIONS.VIEW_USERS),
  async (req, res) => {
    if (!req.user.team) {
      return res.json([]);
    }

    const users = await User.find({
      team: req.user.team,
    }).select("name email team");

    res.json(users);
  }
);


export default router;
