import User from "../models/user.js";
import { getActivePermissions } from "../utils/permission.js";


/** View own profile */
export const getProfile = async (req, res) => {
  
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    team: req.user.team,
    
    permissions: getActivePermissions(req.user)
  });
};

/** View users (scope aware) */
export const getUsers = async (req, res) => {
  const { scope } = req;
  const user = req.user;

  let query = {};
  if (scope === "self") query._id = user._id;
  if (scope === "team") query.team = user.team;

  const users = await User.find(query)
    .select("-passwordHash")
    .populate("team", "name");

  res.json(users);
};

/** Update user */
export const updateUser = async (req, res) => {
  const { name, email } = req.body;
  const targetUser = req.targetUser;

  if (name) targetUser.name = name;
  if (email) targetUser.email = email;

  await targetUser.save();
  res.json({ message: "User updated" });
};

/** Remove user from team */
export const removeUserFromTeam = async (req, res) => {
  const targetUser = req.targetUser;
  targetUser.team = null;
  await targetUser.save();

  res.json({ message: "User removed from team" });
};
