const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('lomall_token');
  if (token) return token;
  const params = new URLSearchParams(window.location.search);
  const t = params.get('token');
  if (t) {
    localStorage.setItem('lomall_token', t);
    return t;
  }
  return null;
}

export async function fetchApi<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem('lomall_token');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function logout() {
  localStorage.removeItem('lomall_token');
  localStorage.removeItem('lomall_guild');
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

export function getStoredGuild(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lomall_guild');
}
