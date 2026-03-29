import mongoose from "mongoose";
import env from "../config/env.js";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Lead from "../models/Lead.js";
import Notification from "../models/Notification.js";
import { ROLES } from "../config/rbac.js";

/**
 * Resets the database and inserts sample users and leads for local testing.
 * @returns {Promise<void>}
 */
const seed = async () => {
  await connectDB(env.mongoUri);

  await Promise.all([
    User.deleteMany({}),
    Lead.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const [admin, manager, sales] = await User.create([
    {
      name: "Admin User",
      email: "admin@crm.com",
      password: "Admin@123",
      role: ROLES.ADMIN,
    },
    {
      name: "Manager User",
      email: "manager@crm.com",
      password: "Manager@123",
      role: ROLES.MANAGER,
    },
    {
      name: "Sales User",
      email: "sales@crm.com",
      password: "Sales@123",
      role: ROLES.SALES,
    },
  ]);

  await Lead.create([
    {
      name: "Acme Corp",
      phone: "+911234567890",
      email: "contact@acme.com",
      source: "website",
      status: "new",
      notes: "Interested in demo",
      createdBy: manager._id,
      assignedTo: sales._id,
    },
    {
      name: "Globex Ltd",
      phone: "+919876543210",
      email: "hello@globex.com",
      source: "referral",
      status: "qualified",
      notes: "Follow-up next week",
      createdBy: admin._id,
      assignedTo: sales._id,
    },
    {
      name: "Initech",
      phone: "+917700112233",
      email: "lead@initech.com",
      source: "campaign",
      status: "contacted",
      notes: "Warm lead",
      createdBy: sales._id,
      assignedTo: sales._id,
    },
  ]);

  console.log("Seed completed successfully");
  console.log(
    "Users: admin@crm.com/Admin@123, manager@crm.com/Manager@123, sales@crm.com/Sales@123",
  );

  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error("Seed failed:", error);
  await mongoose.connection.close();
  process.exit(1);
});
