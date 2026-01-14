import User from "../models/user.js";

/**
 * Checks if a user has a given permission via their roles.
 * Returns permission info if allowed, null otherwise.
 */
export const hasPermission = (user, permissionKey) => {
  const now = new Date();

  for (const roleAssignment of user.roles || []) {
    const role = roleAssignment.roleId;
    if (!role) continue;

    // Check if role is active
    if (roleAssignment.startsAt > now || (roleAssignment.endsAt && roleAssignment.endsAt < now)) {
      continue;
    }

    for (const perm of role.permissions || []) {
      // Check permission validity (optional future start/end on permission)
      const permStarts = perm.startsAt || roleAssignment.startsAt;
      const permEnds = perm.endsAt || roleAssignment.endsAt;

      if (
        perm.permissionKey === permissionKey &&
        permStarts <= now &&
        (!permEnds || permEnds >= now)
      ) {
        return { scope: perm.scope, startsAt: permStarts, endsAt: permEnds };
      }
    }
  }

  return null;
};

/**
 * Resolves the "best" scope from a list of scopes.
 * global > team > self
 */
export const resolveBestScope = (scopes = []) => {
  if (scopes.includes("global")) return "global";
  if (scopes.includes("team")) return "team";
  if (scopes.includes("self")) return "self";
  return null;
};

/**
 * Enforces scope-based access.
 * actor: user performing action
 * target: user/resource being acted upon
 */
export const getActivePermissions = (user) => {
  const now = new Date();
  const permissionMap = new Map();

  for (const roleAssignment of user.roles || []) {
    const role = roleAssignment.roleId;
    if (!role) continue;

    // Role validity
    if (
      roleAssignment.startsAt > now ||
      (roleAssignment.endsAt && roleAssignment.endsAt < now)
    ) {
      continue;
    }

    for (const perm of role.permissions || []) {
      const permStarts = perm.startsAt || roleAssignment.startsAt;
      const permEnds = perm.endsAt || roleAssignment.endsAt;

      if (
        permStarts <= now &&
        (!permEnds || permEnds >= now)
      ) {
        const existing = permissionMap.get(perm.permissionKey) || [];
        permissionMap.set(perm.permissionKey, [...existing, perm.scope]);
      }
    }
  }

  // Resolve best scope per permission
  return Array.from(permissionMap.entries()).map(([key, scopes]) => ({
    key,
    scope: resolveBestScope(scopes)
  }));
};

export const enforceScope = (scope, actor, target) => {
  if (!target) return true;

  if (scope === "global") return true;

  if (scope === "team") {
    return (
      actor.team &&
      target.team &&
      actor.team.toString() === target.team.toString()
    );
  }

  if (scope === "self") {
    return actor._id.toString() === target._id.toString();
  }

  return false;
};
