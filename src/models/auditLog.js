import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    action: {
      type: String,
      required: true
    },
    metadata: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false } // 🔒 immutable
  }
);

export default mongoose.model("AuditLog", auditLogSchema);
