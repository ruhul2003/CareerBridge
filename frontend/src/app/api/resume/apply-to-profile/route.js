// src/app/api/resume/apply-to-profile/route.js
import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

const uri = process.env.MONGODB_URI;

export async function POST(request) {
  try {
    const { userId, profileData, analysisMetadata } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    if (!profileData || typeof profileData !== 'object') {
      return NextResponse.json({ success: false, error: 'No profile data provided' }, { status: 400 });
    }

    if (!uri) {
      return NextResponse.json({ success: false, error: 'Database connection string not configured' }, { status: 500 });
    }

    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db(process.env.AUTH_DB_NAME || 'Career_Bridge');
    const users = db.collection('user');

    const updateFields = {
      updatedAt: new Date(),
    };

    // Apply allowed profile fields if present
    const allowedKeys = [
      'fullName',
      'email',
      'title',
      'phone',
      'location',
      'bio',
      'github',
      'linkedin',
      'portfolio',
      'website',
      'dateOfBirth',
      'languages',
      'resume',
      'resumeUrl',
      'cv',
      'cvUrl',
    ];

    for (const key of allowedKeys) {
      if (profileData[key] !== undefined && profileData[key] !== null) {
        updateFields[key] = typeof profileData[key] === 'string' ? profileData[key].trim() : profileData[key];
      }
    }

    if (Array.isArray(profileData.skills)) {
      updateFields.skills = profileData.skills;
    }

    if (Array.isArray(profileData.education)) {
      updateFields.education = profileData.education;
    }

    if (Array.isArray(profileData.experience)) {
      updateFields.experience = profileData.experience;
    }

    if (analysisMetadata) {
      updateFields.lastResumeAnalysis = {
        atsScore: analysisMetadata.atsScore || null,
        analyzedAt: new Date(),
        fileName: analysisMetadata.fileName || 'Uploaded Resume',
      };
    }

    let query = { id: userId };
    if (ObjectId.isValid(userId)) {
      query = { $or: [{ _id: new ObjectId(userId) }, { id: userId }] };
    }

    const result = await users.updateOne(query, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'User account not found' }, { status: 404 });
    }

    const updatedUser = await users.findOne(query);

    return NextResponse.json({
      success: true,
      message: 'Profile information updated successfully from resume!',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Apply Resume to Profile Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update profile from resume',
      },
      { status: 500 }
    );
  }
}
