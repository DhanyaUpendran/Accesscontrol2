import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.js";
import Role from "../models/role.js";
import { PERMISSIONS } from "../utils/permission.js";
import { hashPassword } from "../utils/auth.js";

dotenv.config();

// MongoDB connection
import connectDB from "../config/db.js";

const createSuperAdmin = async () => {
  try {
    await connectDB();

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ email: "superadmin@example.com" });
    if (existingAdmin) {
      console.log("Super Admin already exists");
      process.exit(0);
    }

    // Create a role with all permissions
    const allPermissions = Object.values(PERMISSIONS).map((key) => ({
      key,
      scope: "global", // Super Admin has global scope
      startsAt: new Date(),
      endsAt: null,
    }));

    const superAdminRole = await Role.create({
      name: "Super Admin",
      permissions: allPermissions,
    });

    // Create user
    const hashedPassword = await hashPassword("superpassword"); // Change password later
    const superAdmin = await User.create({
      name: "Super Admin",
      email: "superadmin@example.com",
      passwordHash: hashedPassword,
      roles: [
        {
          roleId: superAdminRole._id,
          startsAt: new Date(),
          endsAt: null,
        },
      ],
      team: null,
      isAdmin: true,
    });

    console.log("✅ Super Admin created successfully");
    console.log(`Email: ${superAdmin.email}`);
    console.log(`Password: superpassword`);

    process.exit(0);
  } catch (err) {
    console.error("Failed to create Super Admin:", err);
    process.exit(1);
  }
};

createSuperAdmin();
