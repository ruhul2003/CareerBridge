// src/app/api/ai/analyze-resume/route.js
import { NextResponse } from 'next/server';
import { parseTextResume, validateResumeFile } from '@/lib/resumeParser';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

    let fileBase64 = '';
    let mimeType = '';
    let fileName = '';
    let textContent = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');

      if (!file) {
        return NextResponse.json({ success: false, error: 'No resume file provided' }, { status: 400 });
      }

      const validation = validateResumeFile(file);
      if (!validation.valid) {
        return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
      }

      fileName = file.name;
      mimeType = file.type || 'application/octet-stream';

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (fileName.toLowerCase().endsWith('.txt') || mimeType === 'text/plain') {
        textContent = buffer.toString('utf-8');
      } else {
        fileBase64 = buffer.toString('base64');
      }
    } else {
      // JSON body
      const body = await request.json();
      fileBase64 = body.fileBase64 || '';
      mimeType = body.mimeType || '';
      fileName = body.fileName || '';
      textContent = body.textContent || '';
    }

    // Try calling the backend Gemini multimodal analyzer first
    try {
      const backendRes = await fetch(`${serverUrl}/api/ai/analyze-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64,
          mimeType,
          fileName,
          textContent,
        }),
      });

      if (backendRes.ok) {
        const backendData = await backendRes.json();
        if (backendData && backendData.success && backendData.data) {
          return NextResponse.json(backendData);
        }
      }
    } catch (backendError) {
      console.warn('Backend resume AI analysis unavailable, using local parser:', backendError.message);
    }

    // Next.js local heuristic parsing fallback
    const parsedResult = parseTextResume(
      textContent || (fileName ? `Resume for ${fileName.replace(/\.[^/.]+$/, '')}` : ''),
      fileName ? fileName.replace(/\.[^/.]+$/, '') : ''
    );

    return NextResponse.json({
      success: true,
      source: 'nextjs-local-parser',
      data: parsedResult,
    });
  } catch (error) {
    console.error('Resume Analysis API Route Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to analyze resume document',
      },
      { status: 500 }
    );
  }
}
