import User from "../models/user.js";
import { SCOPES } from "./permission.js";

/**
 * Returns the **highest valid scope** for a user for a given permission.
 * If user has no permission, returns null.
 */
/* ===================== PERMISSION RESOLUTION ===================== */

export const hasPermission = (user, permissionKey) => {
  const now = new Date();

  // 1️⃣ Direct permissions
  for (const p of user.directPermissions || []) {
    if (
      p.permissionKey === permissionKey &&
      p.startsAt <= now &&
      (!p.endsAt || p.endsAt >= now)
    ) {
      return p.scope;
    }
  }



  // 2️⃣ Role permissions
  for (const role of user.roles || []) {
    if (role.startsAt > now || (role.endsAt && role.endsAt < now)) continue;

    for (const perm of role.roleId.permissions || []) {
      if (perm.permissionKey === permissionKey) {
        return perm.scope;
      }
    }
  }

  return null;
};


  export const resolveBestScope = (scopes = []) => {
  if (scopes.includes("global")) return "global";
  if (scopes.includes("team")) return "team";
  if (scopes.includes("self")) return "self";
  return null;
};
/* ===================== SCOPE ENFORCEMENT ===================== */

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
