import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Table from "./models/Table.js";
import User from "./models/User.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  await Table.deleteMany({});
  await Table.insertMany([
    { number: 1, capacity: 2 },
    { number: 2, capacity: 2 },
    { number: 3, capacity: 4 },
    { number: 4, capacity: 4 },
    { number: 5, capacity: 6 },
    { number: 6, capacity: 8 },
  ]);

  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    await User.create({
      name: "Restaurant Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });
  }

  console.log("Seed complete");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
