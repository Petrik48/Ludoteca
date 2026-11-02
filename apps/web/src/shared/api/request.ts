import { ApiError } from './ApiError.ts';

const API_BASE = '/api';

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, init);

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body?.message ?? `Request failed: ${path}`);
  }

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}
