import mongoose from "mongoose";

const rolePermissionSchema = new mongoose.Schema(
  {
    permissionKey: {
      type: String,
      required: true,
    },
    scope: {
      type: String,
      enum: ["self", "team", "global"],
      required: true,
    },
  },
  { _id: false }
);

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    permissions: {
      type: [rolePermissionSchema],
      default: [],
    },
  },
  {
    timestamps: true, // replaces createdAt / updatedAt manually
  }
);

export default mongoose.model("Role", roleSchema);
