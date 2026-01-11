import AuditLog from "../models/auditLog.js";

export const logAudit = async (actorId, action, metadata = {}) => {
  try {
    await AuditLog.create({
      actor: actorId,
      action,
      metadata
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
};
