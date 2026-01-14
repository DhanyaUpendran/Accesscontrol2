import AuditLog from "../models/auditLog.js";

/**
 * Records an audit log entry.
 * actorId: ID of user performing the action
 * action: string representing the action
 * details: optional object with extra info
 */
export const logAudit = async (actorId, action, details = {}) => {
  try {
    await AuditLog.create({
      actor: actorId,
      action,
      details
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
};
