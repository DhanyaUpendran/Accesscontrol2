import { hasPermission, enforceScope } from "../utils/permission.js";
import { getUserPermissions } from "../utils/getUserPermissions.js";
/**
 * Usage:
 * access("manage_users")
 * access("edit_user", getTargetUser)
 */
export const access = (permissionKey, getTargetUser) => {
  return async (req, res, next) => {
    console.log("---- ACCESS CHECK ----");
    console.log("Required:", permissionKey);
    console.log("User permissions:", getUserPermissions(req.user));
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 1️⃣ Permission existence
    const perm = hasPermission(user, permissionKey);
    if (!perm) {
      return res.status(403).json({ message: "Permission denied" });
    }

    const now = new Date();

    // 2️⃣ Time-based checks ✅
    if (perm.startsAt && perm.startsAt > now) {
      return res.status(403).json({ message: "Permission not active yet" });
    }

    if (perm.endsAt && perm.endsAt < now) {
      return res.status(403).json({ message: "Permission expired" });
    }

    // 3️⃣ Load target resource (if any)
    let target = null;
    if (getTargetUser) {
      target = await getTargetUser(req);
      if (!target) {
        return res.status(404).json({ message: "Target not found" });
      }

      // 4️⃣ Scope enforcement
      const allowed = enforceScope(perm.scope, user, target);
      if (!allowed) {
        return res.status(403).json({ message: "Scope restriction" });
      }

      req.targetUser = target;
    }

    // 5️⃣ Attach resolved permission
    req.permission = perm;

    next();
  };
};
