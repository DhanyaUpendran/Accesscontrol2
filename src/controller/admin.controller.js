import Role from "../models/role.js";
import Team from "../models/team.js";
import User from "../models/user.js";
import AuditLog from "../models/auditLog.js";
import { logAudit } from "../utils/audit.js";

/* ===================== ROLES ===================== */

export const createRole = async (req, res) => {
  const { name } = req.body;

  const role = await Role.create({
    name,
    permissions: []
  });

  await logAudit(req.user._id, "CREATE_ROLE", { role: name });

  res.status(201).json(role);
};

export const assignPermissionsToRole = async (req, res) => {
  const { roleId } = req.params;
  const { permissions } = req.body;

  const role = await Role.findById(roleId);
  if (!role) return res.status(404).json({ message: "Role not found" });

  role.permissions = permissions;
  await role.save();

  await logAudit(req.user._id, "UPDATE_ROLE_PERMISSIONS", {
    role: role.name,
    permissions
  });

  res.json(role);
};

/* ===================== USERS ===================== */

export const assignRoleToUser = async (req, res) => {
  const { userId, roleId } = req.body;

  const user = await User.findById(userId);
  const role = await Role.findById(roleId);

  if (!user || !role)
    return res.status(404).json({ message: "User or Role not found" });

  user.roles.push({
    roleId: role._id,
    startsAt: new Date(),
    endsAt: null
  });

  await user.save();

  await logAudit(req.user._id, "ASSIGN_ROLE", {
    user: user.email,
    role: role.name
  });

  res.json({ message: "Role assigned to user" });
};

/* ===================== TEAMS ===================== */

export const createTeam = async (req, res) => {
  const { name } = req.body;

  const team = await Team.create({ name });

  await logAudit(req.user._id, "CREATE_TEAM", { team: name });

  res.status(201).json(team);
};

export const assignUserToTeam = async (req, res) => {
  const { userId, teamId } = req.body;

  const user = await User.findById(userId);
  const team = await Team.findById(teamId);

  if (!user || !team)
    return res.status(404).json({ message: "User or Team not found" });

  user.team = team._id;
  await user.save();

  await logAudit(req.user._id, "ASSIGN_USER_TO_TEAM", {
    user: user.email,
    team: team.name
  });

  res.json({ message: "User assigned to team" });
};

/* ===================== AUDIT LOGS ===================== */

export const getAuditLogs = async (req, res) => {
  const logs = await AuditLog.find()
    .populate("actor", "email")
    .sort({ createdAt: -1 })
    .limit(100);

  res.json(logs);
};
