import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  permissions: [
    {
      permissionKey: String,
      scope: String
    }
  ]
}, { timestamps: true });

export default mongoose.model("Role", roleSchema);
