import { GameDto } from '@/shared/types/game';
import { request } from '@/shared/api';

export const fetchGame = (id: string) => request<GameDto>(`/games/${id}`);
