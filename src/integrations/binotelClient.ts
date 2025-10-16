import crypto from 'crypto';

const BINOTEL_API_BASE = process.env.BINOTEL_API_BASE || 'https://api.binotel.com';
const BINOTEL_API_KEY = process.env.BINOTEL_API_KEY;
const BINOTEL_API_SECRET = process.env.BINOTEL_API_SECRET;

if (!BINOTEL_API_KEY || !BINOTEL_API_SECRET) {
  console.warn('[binotel] BINOTEL_API_KEY/SECRET not set. Use a .env file and do not commit secrets.');
}

type HttpMethod = 'GET' | 'POST';

async function request(path: string, method: HttpMethod = 'GET', body?: any) {
  const url = new URL(path, BINOTEL_API_BASE).toString();
  const ts = Math.floor(Date.now() / 1000);

  // Placeholder signing: Binotel often expects API key + signature (HMAC) + ts; adjust after checking exact docs
  const payload = body ? JSON.stringify(body) : '';
  const signBase = `${method}\n${path}\n${ts}\n${payload}`;
  const signature = crypto
    .createHmac('sha256', BINOTEL_API_SECRET || '')
    .update(signBase)
    .digest('hex');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Api-Key': BINOTEL_API_KEY || '',
    'X-Api-Ts': String(ts),
    'X-Api-Sign': signature,
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  } as RequestInit);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[binotel] ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}

export const binotel = {
  // Example: get calls list for a date; update path/params per docs
  getCallsForDate: async (dateISO: string) => {
    const path = `/v1/calls?date=${encodeURIComponent(dateISO)}`;
    return request(path, 'GET');
  },
  // Example: get call by id
  getCall: async (id: string) => request(`/v1/calls/${encodeURIComponent(id)}`, 'GET'),
};

export type BinotelCall = {
  id: string;
  direction: 'in' | 'out';
  status: string;
  from: string;
  to: string;
  startedAt: string; // ISO
  durationSec: number;
};