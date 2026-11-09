export async function checkServerStatus() {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Status endpoint unavailable');
    return await res.json();
  } catch (err) {
    return { status: 'offline', hasGeminiKey: false };
  }
}

export async function requestStudyAssistant(notes: string, mode: string, options?: { depth?: string; subject?: string }) {
  const response = await fetch('/api/ai/study-assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes, mode, options }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to process notes');
  }

  return await response.json();
}

export async function requestDoubtSolver(query: string, history: Array<{ role: 'user' | 'model'; content: string }>, subject?: string) {
  const response = await fetch('/api/ai/doubt-solver', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, history, subject }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to solve doubt');
  }

  return await response.json();
}

export async function requestStudyPlan(subjects: any[], dailyHours: number, targetDays: number) {
  const response = await fetch('/api/ai/study-planner', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subjects, dailyHours, targetDays }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to generate study plan');
  }

  return await response.json();
}

export async function requestResumeBulletEnhancement(bulletText: string, role?: string) {
  const response = await fetch('/api/ai/resume-enhancer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bulletText, role }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to enhance bullet point');
  }

  return await response.json();
}

export async function requestMockInterviewEvaluation(question: string, answer: string, type: string, role?: string) {
  const response = await fetch('/api/ai/mock-interview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answer, type, role }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to evaluate interview response');
  }

  return await response.json();
}
