import User from "../models/user.js";

/**
 * Returns the **highest valid scope** for a user for a given permission.
 * If user has no permission, returns null.
 */
export async function hasPermission(user, permissionKey) {
  if (!user) return null;

  const now = new Date();

  // Direct permissions
  const direct = user.directPermissions.find(p =>
    p.permissionKey.toLowerCase() === permissionKey.toLowerCase() &&
    (!p.startsAt || p.startsAt <= now) &&
    (!p.endsAt || p.endsAt >= now)
  );
  if (direct) return direct.scope;

  // Roles
  for (const roleAssignment of user.roles) {
    if (roleAssignment.endsAt && roleAssignment.endsAt < now) continue;

    const role = await roleAssignment.roleId.populate("permissions").execPopulate?.() || roleAssignment.roleId;
    if (!role.permissions) continue;

    const perm = role.permissions.find(p =>
      p.permissionKey.toLowerCase() === permissionKey.toLowerCase()
    );
    if (perm) return perm.scope;
  }

  return null;
}

/**
 * Enforces scope rules:
 * - self → targetUser must be the user
 * - team → targetUser must be in same team
 * - global → allowed
 */
export function enforceScope(scope, user, targetUser) {
  if (!scope || !user || !targetUser) return false;

  switch (scope) {
    case "self":
      return user._id.toString() === targetUser._id.toString();
    case "team":
      return user.team && targetUser.team && user.team.toString() === targetUser.team.toString();
    case "global":
      return true;
    default:
      return false;
  }
}
