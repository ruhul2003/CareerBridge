// src/app/api/users/[id]/route.js
import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET(request, { params }) {
  try {
    const { id } = await params;   // ← This is the fix

    await client.connect();
    const db = client.db(process.env.AUTH_DB_NAME || "hireloop_db");
    const users = db.collection("user");

    const user = await users.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;   // ← This is the fix

    const body = await request.json();

    await client.connect();
    const db = client.db(process.env.AUTH_DB_NAME || "hireloop_db");
    const users = db.collection("user");

    const updateFields = { 
      fullName: body.fullName,
      email: body.email,
      title: body.title,
      skills: body.skills || [],
      updatedAt: new Date()
    };

    if (body.resume !== undefined || body.resumeUrl !== undefined) {
      const r = body.resume || body.resumeUrl || "";
      updateFields.resume = r;
      updateFields.resumeUrl = r;
    }
    if (body.cv !== undefined || body.cvUrl !== undefined) {
      const c = body.cv || body.cvUrl || "";
      updateFields.cv = c;
      updateFields.cvUrl = c;
    }

    const result = await users.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}