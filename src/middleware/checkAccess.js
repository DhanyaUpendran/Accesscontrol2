import { hasPermission, enforceScope } from "../utils/access.util.js";

const checkAccess = (permissionKey, getTargetUser) => {
  return async (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Not authenticated" });

    const scope = await hasPermission(user, permissionKey);
    if (!scope) return res.status(403).json({ message: "Permission denied" });

    req.scope = scope;

    if (getTargetUser) {
      const targetUser = await getTargetUser(req);
      if (!enforceScope(scope, user, targetUser)) {
        return res.status(403).json({ message: "Scope restriction" });
      }
    }

    next();
  };
};

export default checkAccess;
