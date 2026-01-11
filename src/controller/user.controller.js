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
    }

    if (scope === "team") {
      query.team = user.team;
    }

    // global → no filter

    const users = await User.find(query)
      .select("-passwordHash")
      .populate("team", "name");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/**
 * UPDATE USER (name / email)
 */
export const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const targetUser = req.targetUser;

    if (name) targetUser.name = name;
    if (email) targetUser.email = email;

    await targetUser.save();

    res.json({ message: "User updated successfully" });
  } catch (err) {
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
    res.status(500).json({ message: "Failed to remove user from team" });
  }
};
