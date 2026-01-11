import { hasPermission } from "../utils/permission.js";
import { resolveBestScope, enforceScope } from "../utils/access.utils.js";

const checkAccess = (permissions, getTargetUser) => {
  const permissionList = Array.isArray(permissions)
    ? permissions
    : [permissions];

  return async (req, res, next) => {
    const scopes = [];

    for (const perm of permissionList) {
      const scope = await hasPermission(req.user, perm);
      if (scope) scopes.push(scope);
    }

    const finalScope = resolveBestScope(scopes);

    if (!finalScope) {
      return res.status(403).json({ message: "Permission denied" });
    }

    req.scope = finalScope;

    if (getTargetUser) {
      const target = await getTargetUser(req);
      if (!target) {
        return res.status(404).json({ message: "Target not found" });
      }

      if (!enforceScope(finalScope, req.user, target)) {
        return res.status(403).json({ message: "Scope restriction" });
      }
    }

    next();
  };
};

export default checkAccess;
