import type { Game } from '../../generated/prisma-client';
import type { GameDto } from '@ludoteca/types';

export function toGameDto(game: Game): GameDto {
  return {
    id: game.id,
    name: game.name,
    type: game.type,
    bggId: game.bggId,
    createdAt: game.createdAt.toISOString(),
    updatedAt: game.updatedAt.toISOString(),
  };
}
