import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  permissionKey: { type: String, required: true },
  scope: { type: String, required: true }, // self, team, global
  startsAt: { type: Date, default: Date.now },
  endsAt: { type: Date, default: null },
});

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: [permissionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Role", roleSchema);
