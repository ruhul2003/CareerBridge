import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

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
    const token = body.token?.trim();
    const email = body.email?.trim()?.toLowerCase();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Verification token is required." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const usersCollection = db.collection("user");
    const verificationCollection = db.collection("verification");

    // Query for token
    const query = { value: token };
    if (email) {
      query.identifier = email;
    }

    const verificationRecord = await verificationCollection.findOne(query);

    if (!verificationRecord) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired verification link/token." },
        { status: 400 }
      );
    }

    if (new Date(verificationRecord.expiresAt) < new Date()) {
      await verificationCollection.deleteOne({ _id: verificationRecord._id });
      return NextResponse.json(
        { success: false, message: "This verification link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const targetEmail = verificationRecord.identifier;

    // Mark user emailVerified = true
    const updateResult = await usersCollection.updateOne(
      { email: targetEmail },
      { $set: { emailVerified: true, updatedAt: new Date() } }
    );

    // Clean up consumed token
    await verificationCollection.deleteOne({ _id: verificationRecord._id });

    return NextResponse.json({
      success: true,
      message: "Email address verified successfully!",
      email: targetEmail,
      updated: updateResult.modifiedCount > 0,
    });
  } catch (error) {
    console.error("[Verify Token API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to verify email." },
      { status: 500 }
    );
  }
}
