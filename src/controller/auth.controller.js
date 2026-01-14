import User from "../models/user.js";
import { comparePassword, generateToken } from "../utils/auth.js";
import { getUserPermissions } from "../utils/getUserPermissions.js"; // updated path


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
console.log("LOGIN BODY:", req.body);

    const user = await User.findOne({ email })
      .populate("roles.roleId"); // roles now contain permissions
console.log("USER FOUND:", user);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    const permissions = getUserPermissions(user);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        

        roles: user.roles
      },
      permissions
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
