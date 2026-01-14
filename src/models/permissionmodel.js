import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  permissionKey: {
    type: String,
    required: true,
    unique: true,
  },
  description: String, // optional human-readable description
});

export default mongoose.model("Permission", permissionSchema);
