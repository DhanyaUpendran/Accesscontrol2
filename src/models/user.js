import mongoose from "mongoose";

const roleAssignmentSchema = new mongoose.Schema({
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  startsAt: { type: Date, default: Date.now },
  endsAt: { type: Date, default: null }
});

const permissionAssignmentSchema = new mongoose.Schema({
  permissionKey: String,
  scope: String,
  startsAt: { type: Date, default: Date.now },
  endsAt: { type: Date, default: null }
});

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    roles: [roleAssignmentSchema],
    directPermissions: [permissionAssignmentSchema],
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
