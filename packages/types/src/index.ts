// ── Domain constants ──────────────────────────────────────────────

export const GAME_TYPES = ['PNP', 'PUBLISHED'] as const;
export type GameType = (typeof GAME_TYPES)[number];

// ── Game DTOs ────────────────────────────────────────────────────

export interface GameDto {
  id: string;
  name: string;
  type: GameType;
  bggId: number | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface CreateGameInput {
  name: string;
  type: GameType;
  bggId?: number;
}

export interface UpdateGameInput {
  name?: string;
  type?: GameType;
  bggId?: number | null;
}

// ── Play DTOs ────────────────────────────────────────────────────

export interface PlayDto {
  id: string;
  gameId: string;
  playedAt: string; // YYYY-MM-DD
  note: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface CreatePlayInput {
  gameId: string;
  playedAt: string; // YYYY-MM-DD
  note?: string;
}

export interface UpdatePlayInput {
  gameId?: string;
  playedAt?: string; // YYYY-MM-DD
  note?: string | null;
}
