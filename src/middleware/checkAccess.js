import { hasPermission, enforceScope } from "../utils/access.util.js";

const checkAccess = (permissionKey, getTargetUser) => {
  return async (req, res, next) => {
    console.log("🛂 checkAccess called for:", permissionKey);

    const permission = await hasPermission(req.user, permissionKey);

    // Permission not found or expired
    if (!permission) {
      console.log("🚫 ACCESS DENIED: Permission missing or expired");
      return res.status(403).json({ message: "Permission denied" });
    }

    const now = new Date();
    if (permission.startsAt && permission.startsAt > now) {
      console.log("🚫 ACCESS DENIED: Permission not started yet");
      return res.status(403).json({ message: "Permission not active yet" });
    }
    if (permission.endsAt && permission.endsAt < now) {
      console.log("🚫 ACCESS DENIED: Permission expired");
      return res.status(403).json({ message: "Permission expired" });
    }

    req.scope = permission.scope;

    if (getTargetUser) {
      const targetUser = await getTargetUser(req);

      if (!enforceScope(permission.scope, req.user, targetUser)) {
        return res.status(403).json({ message: "Scope restriction" });
      }

      req.targetUser = targetUser;
    }

    next();
  };
};

export default checkAccess;
