import type { Property, Development, PropertyAgent } from '../data/types';

const API_BASE = 'http://localhost:4000/api';

type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: { page: number; limit: number; total: number };
};

function snakeToCamel<T>(obj: unknown): T {
  if (Array.isArray(obj)) return obj.map(snakeToCamel) as unknown as T;
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, val]) => [
        key.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
        snakeToCamel(val),
      ]),
    ) as T;
  }
  return obj as unknown as T;
}

function getToken(): string | null {
  try {
    return localStorage.getItem('viviana_token');
  } catch {
    return null;
  }
}

function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem('viviana_token', token);
    else localStorage.removeItem('viviana_token');
  } catch {}
}

export function clearToken(): void {
  setToken(null);
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, { headers, ...options });
  } catch {
    throw new Error('No se pudo conectar con el servidor');
  }

  let body: ApiResponse<T>;
  try {
    body = await res.json();
  } catch {
    throw new Error('Respuesta inválida del servidor');
  }

  if (!res.ok) {
    throw new Error(body.error ?? `Error ${res.status}`);
  }
  if (!body.success || !body.data) {
    throw new Error(body.error ?? 'Error desconocido');
  }
  return snakeToCamel<T>(body.data);
}

export async function fetchProperties(params?: {
  type?: string; operation?: string; status?: string; featured?: boolean;
  search?: string; page?: number; limit?: number;
}): Promise<{ data: Property[]; pagination: { page: number; limit: number; total: number } }> {
  const query = new URLSearchParams();
  if (params?.type) query.set('type', params.type);
  if (params?.operation) query.set('operation', params.operation);
  if (params?.status) query.set('status', params.status);
  if (params?.featured) query.set('featured', 'true');
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  const endpoint = `/properties${qs ? `?${qs}` : ''}`;

  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, { headers });
  } catch {
    throw new Error('No se pudo conectar con el servidor');
  }

  let body: ApiResponse<Property[]>;
  try {
    body = await res.json();
  } catch {
    throw new Error('Respuesta inválida del servidor');
  }

  if (!res.ok || !body.success) {
    throw new Error(body.error ?? `Error ${res.status}`);
  }

  return {
    data: snakeToCamel<Property[]>(body.data ?? []),
    pagination: body.pagination ?? { page: 1, limit: 20, total: 0 },
  };
}

export async function fetchPropertyById(id: string): Promise<Property> {
  return request<Property>(`/properties/${id}`);
}

export async function fetchAgents(search?: string): Promise<PropertyAgent[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return request<PropertyAgent[]>(`/agents${query}`);
}

export async function fetchAgentById(id: string): Promise<PropertyAgent> {
  return request<PropertyAgent>(`/agents/${id}`);
}

export async function fetchDevelopments(): Promise<Development[]> {
  return request<Development[]>('/developments');
}

export async function loginUser(email: string, password: string): Promise<{
  token: string;
  user: { id: number; name: string; email: string; role: string; avatarUrl?: string };
}> {
  const result = await request<{
    token: string;
    user: { id: number; name: string; email: string; role: string; avatarUrl?: string };
  }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(result.token);
  return result;
}

export async function registerUser(email: string, password: string, name: string): Promise<{
  token: string;
  user: { id: number; name: string; email: string; role: string; avatarUrl?: string };
}> {
  const result = await request<{
    token: string;
    user: { id: number; name: string; email: string; role: string; avatarUrl?: string };
  }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  setToken(result.token);
  return result;
}

export async function fetchMe(): Promise<{
  id: number; name: string; email: string; role: string; avatarUrl?: string;
}> {
  return request('/auth/me');
}

export function getStoredToken(): string | null {
  return getToken();
}
