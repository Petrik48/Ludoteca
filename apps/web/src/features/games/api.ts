import { GameDto } from './types';
import { CreateGameFormData } from './schemas.ts';

const API_BASE = '/api';

export async function fetchGames(): Promise<GameDto[]> {
  const response = await fetch(`${API_BASE}/games`);
  if (!response.ok) throw new Error('Failed to fetch games');
  return response.json();
}

export async function createGame(data: CreateGameFormData): Promise<GameDto> {
  const response = await fetch(`${API_BASE}/games`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create game');
  return response.json();
}

export async function updateGame(params: {
  id: string;
  data: CreateGameFormData;
}): Promise<GameDto> {
  const { id, data } = params;
  const response = await fetch(`${API_BASE}/games/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update game');
  return response.json();
}

export async function deleteGame(params: { id: string }): Promise<void> {
  const { id } = params;
  const response = await fetch(`${API_BASE}/games/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (response.status === 409) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? 'This game has logged plays and cannot be deleted.');
  }
  if (!response.ok) throw new Error('Failed to delete game');
}
