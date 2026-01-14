import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true }, // e.g., "CREATE_USER", "ASSIGN_ROLE"
  targetType: { type: String }, // e.g., "User", "Role"
  targetId: { type: mongoose.Schema.Types.ObjectId },
  details: { type: Object }, // JSON object with changes or additional info
  createdAt: { type: Date, default: Date.now, immutable: true },
});

export default mongoose.model("AuditLog", auditLogSchema);
