import { GameDto } from '@/shared/types';
import { CreateGameFormData } from './schemas.ts';
import { request } from '@/shared/api';

export const fetchGames = () => request<GameDto[]>('/games');

export const createGame = (data: CreateGameFormData) =>
  request<GameDto>('/games', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const updateGame = ({ id, data }: { id: string; data: CreateGameFormData }) =>
  request<GameDto>(`/games/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const deleteGame = ({ id }: { id: string }) =>
  request<void>(`/games/${id}`, { method: 'DELETE' });
