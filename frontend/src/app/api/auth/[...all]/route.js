import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

let adminSeeded = false;

const seedAdmin = async () => {
  if (adminSeeded) return;
  adminSeeded = true;
  try {
    await auth.api.signUpEmail({
      body: {
        email: "admin@gmail.com",
        password: "admin123",
        name: "Admin",
        role: "admin",
        plan: "admin_plan",
      },
    });
    console.log("=== Admin user seeded successfully! ===");
  } catch (err) {
    console.log("Admin seeding skipped or user exists:", err.message || err);
  }
};

const handler = toNextJsHandler(auth);

export const GET = async (req, ctx) => {
  await seedAdmin();
  return handler.GET(req, ctx);
};

export const POST = async (req, ctx) => {
  await seedAdmin();
  return handler.POST(req, ctx);
};