import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  roles: [
    {
      roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
      startsAt: { type: Date, default: Date.now },
      endsAt: { type: Date, default: null },
    },
  ],
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null },
  isActive: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
