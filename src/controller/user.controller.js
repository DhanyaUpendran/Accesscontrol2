import User from "../models/user.js";

/**
 * GET USERS (scope aware)
 */
export const getUsers = async (req, res) => {
  try {
    const scope = req.scope;
    const user = req.user;

    let query = {};

    if (scope === "self") {
      query._id = user._id;
    } else if (scope === "team") {
      query.team = user.team;
    }
    // global → no filter

    const users = await User.find(query)
      .select("-passwordHash")
      .populate("team", "name");

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/**
 * GET CURRENT USER PROFILE
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-passwordHash")
      .populate("team", "name");

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/**
 * UPDATE USER (name / email)
 */
export const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const targetUser = req.targetUser;

    const permission = req.user.permissions.find(
      (p) => p.key === "UPDATE_PROFILE"
    );

    const now = new Date();
    if (!permission || (permission.endsAt && permission.endsAt < now)) {
      return res.status(403).json({ message: "Permission expired or denied" });
    }

    if (name) targetUser.name = name;
    if (email) targetUser.email = email;

    await targetUser.save();

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
};

/**
 * REMOVE USER FROM TEAM (NOT DELETE USER)
 */
export const removeUserFromTeam = async (req, res) => {
  try {
    const targetUser = req.targetUser;

    targetUser.team = null;
    await targetUser.save();

    res.json({ message: "User removed from team" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove user from team" });
  }
};
