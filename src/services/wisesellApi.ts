import { auth } from '../firebase/config';

const API_BASE_URL = String((import.meta as any).env?.VITE_WISESELL_API_URL || '')
  .trim()
  .replace(/\/$/, '');

export async function getWiseSellApiHealth() {
  if (!API_BASE_URL) throw new Error('WiseSell staging API URL is not configured.');
  const response = await fetch(`${API_BASE_URL}/api/v1/health`, {
    headers: { Accept: 'application/json' }
  });
  if (!response.ok) throw new Error(`WiseSell API health check failed (${response.status}).`);
  return response.json();
}

export async function requestWiseSellAi(prompt: string): Promise<{ answer: string; model?: string }> {
  if (!API_BASE_URL) {
    throw new Error('WiseSell staging API URL is not configured. Set VITE_WISESELL_API_URL in the frontend staging environment.');
  }
  const user = auth.currentUser;
  if (!user) throw new Error('Please sign in again to use WiseSell AI.');
  const token = await user.getIdToken();
  const response = await fetch(`${API_BASE_URL}/api/v1/ai/assist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ prompt })
  });
  const payload = await response.json().catch(() => ({}));
  if (response.status === 401) throw new Error('Your session has expired. Sign in again and retry.');
  if (!response.ok) {
    throw new Error(payload.message || payload.error || `WiseSell AI request failed (${response.status}).`);
  }
  if (typeof payload.answer !== 'string' || !payload.answer.trim()) {
    throw new Error('The WiseSell AI backend returned an empty response.');
  }
  return payload;
}
