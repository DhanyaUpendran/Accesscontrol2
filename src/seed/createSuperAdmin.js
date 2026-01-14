import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.js";
import Role from "../models/role.js";
import { PERMISSIONS } from "../utils/constants.js";
import { hashPassword } from "../utils/auth.js";
import connectDB from "../config/db.js";

dotenv.config();

const SUPERADMIN_EMAIL = "superadmin@example.com";

const createSuperAdmin = async () => {
  try {
    await connectDB();

    // 🔒 Require explicit password
    if (!process.env.SUPERADMIN_PASSWORD) {
      throw new Error("SUPERADMIN_PASSWORD is not set in .env");
    }

    // 🔁 Find or create role (idempotent)
    let superAdminRole = await Role.findOne({ name: "Super Admin" });

    if (!superAdminRole) {
      const allPermissions = Object.values(PERMISSIONS).map((key) => ({
        permissionKey: key,
        scope: "global",
        startsAt: new Date(),
        endsAt: null,
      }));

      superAdminRole = await Role.create({
        name: "Super Admin",
        permissions: allPermissions,
      });
    }

    // 🔁 Find or create user
    let superAdmin = await User.findOne({ email: SUPERADMIN_EMAIL });

    if (!superAdmin) {
      const hashedPassword = await hashPassword(
        process.env.SUPERADMIN_PASSWORD.trim()
      );

      superAdmin = await User.create({
        name: "Super Admin",
        email: SUPERADMIN_EMAIL.toLowerCase(),
        passwordHash: hashedPassword,
        roles: [
          { roleId: superAdminRole._id, startsAt: new Date(), endsAt: null }
        ],
        team: null,
        isAdmin: true,
        isActive: true,
      });

      console.log("✅ Super Admin created");
    } else {
      console.log("ℹ️ Super Admin already exists");
    }

    console.log(`📧 Email: ${superAdmin.email}`);
    console.log("🔑 Password set from SUPERADMIN_PASSWORD");

    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to create Super Admin:", err.message);
    process.exit(1);
  }
};

createSuperAdmin();
