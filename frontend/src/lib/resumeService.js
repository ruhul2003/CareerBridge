/**
 * Client-Side Resume Service
 * Handles file reading, resume API requests, and profile syncing.
 */

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      // Extract base64 part after comma
      const base64 = typeof result === 'string' ? result.split(',')[1] : '';
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result || '');
    reader.onerror = (error) => reject(error);
  });
}

export async function analyzeResumeFile(file) {
  if (!file) throw new Error('No file provided for analysis');

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/ai/analyze-resume', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || data.message || 'Failed to analyze resume');
  }

  return data.data;
}

export async function syncResumeToProfile(userId, profileData, analysisMetadata = null) {
  if (!userId) throw new Error('User identifier is missing');

  const res = await fetch('/api/resume/apply-to-profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      profileData,
      analysisMetadata,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || data.message || 'Failed to apply resume to profile');
  }

  return data;
}

export function computeProfileDiff(currentProfile = {}, extractedProfile = {}) {
  const fields = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'title', label: 'Professional Title' },
    { key: 'email', label: 'Email Address' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'location', label: 'Location' },
    { key: 'bio', label: 'Bio / Summary' },
    { key: 'github', label: 'GitHub Link' },
    { key: 'linkedin', label: 'LinkedIn Link' },
    { key: 'portfolio', label: 'Portfolio Link' },
    { key: 'website', label: 'Website' },
    { key: 'languages', label: 'Languages' },
  ];

  return fields.map((f) => {
    const currentVal = currentProfile[f.key] || '';
    const extractedVal = extractedProfile[f.key] || '';
    const hasChange = extractedVal && extractedVal !== currentVal;
    return {
      key: f.key,
      label: f.label,
      current: currentVal,
      extracted: extractedVal,
      hasChange,
      selected: Boolean(extractedVal),
    };
  });
}
