// src/app/api/upload-document/route.js
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const userId = formData.get('userId');
    const docType = formData.get('type') || 'document'; // 'resume' or 'cv'

    if (!file || !userId) {
      return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 });
    }

    // Validate size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Validate file extension
    const ext = path.extname(file.name).toLowerCase();
    const allowedExts = ['.pdf', '.doc', '.docx', '.txt'];
    if (!allowedExts.includes(ext)) {
      return NextResponse.json({ error: 'Only PDF, DOC, DOCX, and TXT files are allowed' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'documents');
    
    // Create directory if it doesn't exist
    await mkdir(uploadsDir, { recursive: true });

    const filename = `${userId}-${docType}-${Date.now()}${ext}`;
    const filepath = path.join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    const documentUrl = `/uploads/documents/${filename}`;

    return NextResponse.json({ 
      success: true, 
      documentUrl,
      fileName: file.name
    });

  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload document',
      details: error.message 
    }, { status: 500 });
  }
}
