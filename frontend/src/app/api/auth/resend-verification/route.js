import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email-service";

const uri = process.env.MONGODB_URI || "mongodb+srv://hire_loop_db_user:wwiIRfECMOKwPwpl@tilux-server.cltfmst.mongodb.net/?appName=Tilux-server";
const dbName = process.env.AUTH_DB_NAME || "Career_Bridge";

let clientPromise = null;

async function getDb() {
  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  const client = await clientPromise;
  return client.db(dbName);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body.email?.trim()?.toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email address is required." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const usersCollection = db.collection("user");
    const verificationCollection = db.collection("verification");

    // Check if user exists
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No account found with this email address." },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: "Your email address is already verified!",
      });
    }

    // Generate secure token
    const token = crypto.randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Remove any previous pending verification tokens for this email
    await verificationCollection.deleteMany({ identifier: email });

    // Store new verification record compatible with Better-Auth
    await verificationCollection.insertOne({
      id: crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex"),
      identifier: email,
      value: token,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000";
    const verifyUrl = `${appBaseUrl}/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

    // Dispatch real-time email
    const emailResult = await sendVerificationEmail({
      to: email,
      name: user.name || "CareerBridge Member",
      verifyUrl,
      token,
    });

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully! Please check your inbox.",
      details: emailResult,
    });
  } catch (error) {
    console.error("[Resend Verification API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send verification email." },
      { status: 500 }
    );
  }
}
