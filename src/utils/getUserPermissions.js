/**
 * Returns all active permissions of a user from their roles.
 */
export const getUserPermissions = (user) => {
  const now = new Date();
  const perms = new Map();

  for (const roleAssignment of user.roles || []) {
    const role = roleAssignment.roleId;
    if (!role) continue;

    if (roleAssignment.startsAt > now || (roleAssignment.endsAt && roleAssignment.endsAt < now)) {
      continue;
    }

    for (const perm of role.permissions || []) {
      const permStarts = perm.startsAt || roleAssignment.startsAt;
      const permEnds = perm.endsAt || roleAssignment.endsAt;

      if (permStarts <= now && (!permEnds || permEnds >= now)) {
        perms.set(perm.permissionKey, {
          permissionKey: perm.permissionKey,
          scope: perm.scope
        });
      }
    }
  }

  return Array.from(perms.values());
};
