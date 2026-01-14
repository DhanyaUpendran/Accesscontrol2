import jwt from "jsonwebtoken";
import User from "../models/user.js";

/**
 * Auth middleware
 * - Verifies JWT token
 * - Loads user with roles and team
 */
const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user with roles and team
    const user = await User.findById(decoded.id)
      .populate("roles.roleId") // roles now contain permissions
      .populate("team");

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User not found or inactive" });
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default auth;
