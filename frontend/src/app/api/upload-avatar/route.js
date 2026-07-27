// src/app/api/upload-avatar/route.js
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('avatar');
    const userId = formData.get('userId');

    if (!file || !userId) {
      return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files allowed' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');
    
    // Create directory if it doesn't exist
    await mkdir(uploadsDir, { recursive: true });

    const filename = `${userId}-${Date.now()}${path.extname(file.name)}`;
    const filepath = path.join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    const avatarUrl = `/uploads/avatars/${filename}`;

    // Optional: Update user in database
    // await updateUserAvatar(userId, avatarUrl);

    return NextResponse.json({ 
      success: true, 
      avatarUrl 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload image',
      details: error.message 
    }, { status: 500 });
  }
}