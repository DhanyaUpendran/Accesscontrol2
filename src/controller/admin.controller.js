import Role from "../models/role.js";
import Team from "../models/team.js";
import User from "../models/user.js";
import AuditLog from "../models/auditLog.js";
import { logAudit } from "../utils/audit.js";
import { hashPassword } from "../utils/auth.js";

/** Create Role */
export const createRole = async (req, res) => {
  const { name } = req.body;
  const role = await Role.create({ name, permissions: [] });
  await logAudit(req.user._id, "CREATE_ROLE", { role: name });
  res.status(201).json(role);
};

/** Assign Permissions to Role */
export const assignPermissionsToRole = async (req, res) => {
  const { roleId } = req.params;
  const { permissions } = req.body;

  const role = await Role.findById(roleId);
  if (!role) return res.status(404).json({ message: "Role not found" });

  role.permissions = permissions.map(p => ({
    permissionKey: p.permissionKey,
    scope: p.scope || "self",
    startsAt: p.startsAt || new Date(),
    endsAt: p.endsAt || null
  }));

  await role.save();
  await logAudit(req.user._id, "UPDATE_ROLE_PERMISSIONS", { role: role.name, permissions });
  res.json(role);
};

/** Create User */
export const createUser = async (req, res) => {
  try {
    const { name, email, password, roles, teamId } = req.body;

    // Validate
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    const user = new User({
      name,
      email,
      passwordHash: hashedPassword,
      roles: [],
      team: null,
    });

    // Assign roles
    if (roles && roles.length) {
      for (const r of roles) {
        const role = await Role.findById(r.roleId);
        if (!role)
          return res.status(400).json({ message: "Role not found" });

        user.roles.push({
          roleId: r.roleId,
          startsAt: r.startsAt || new Date(),
          endsAt: r.endsAt || null,
        });
      }
    }

    // Assign team
    if (teamId) {
      const team = await Team.findById(teamId);
      if (!team)
        return res.status(400).json({ message: "Team not found" });
      user.team = team._id;
    }

    await user.save();
    await logAudit(req.user._id, "CREATE_USER", { user: email });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/** Assign Role to User */
export const assignRoleToUser = async (req, res) => {
  const { userId, roleId, startsAt, endsAt } = req.body;

  const user = await User.findById(userId);
  const role = await Role.findById(roleId);
  if (!user || !role) return res.status(404).json({ message: "User or Role not found" });

  user.roles.push({ roleId: role._id, startsAt: startsAt || new Date(), endsAt: endsAt || null });
  await user.save();

  await logAudit(req.user._id, "ASSIGN_ROLE", { user: user.email, role: role.name, startsAt, endsAt });
  res.json({ message: "Role assigned to user" });
};

/** Create Team */
export const createTeam = async (req, res) => {
  const { name } = req.body;
  const team = await Team.create({ name });
  await logAudit(req.user._id, "CREATE_TEAM", { team: name });
  res.status(201).json(team);
};

/** Assign User to Team */
export const assignUserToTeam = async (req, res) => {
  const { userId, teamId } = req.body;

  const user = await User.findById(userId);
  const team = await Team.findById(teamId);
  if (!user || !team) return res.status(404).json({ message: "User or Team not found" });

  user.team = team._id;
  await user.save();

  await logAudit(req.user._id, "ASSIGN_USER_TO_TEAM", { user: user.email, team: team.name });
  res.json({ message: "User assigned to team" });
};

/** Get Audit Logs */
export const getAuditLogs = async (req, res) => {
  const logs = await AuditLog.find().populate("actor", "email").sort({ createdAt: -1 }).limit(100);
  res.json(logs);
};
