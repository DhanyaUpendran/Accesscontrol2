import mongoose from "mongoose";

const roleAssignmentSchema = new mongoose.Schema({
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  startsAt: { type: Date, default: Date.now },
  endsAt: { type: Date, default: null },
});

const permissionAssignmentSchema = new mongoose.Schema({
  permissionKey: { type: String, required: true },
  scope: { type: String, required: true },
  startsAt: { type: Date, default: Date.now },
  endsAt: { type: Date, default: null },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    roles: [roleAssignmentSchema],
    directPermissions: [permissionAssignmentSchema],
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
