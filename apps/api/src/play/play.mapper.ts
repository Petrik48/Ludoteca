import type { Play } from '../../generated/prisma-client';
import type { PlayDto } from '@ludoteca/types';

/**
 * Formats a Prisma Date (stored as @db.Date, midnight UTC) to YYYY-MM-DD string.
 */
function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function toPlayDto(play: Play): PlayDto {
  return {
    id: play.id,
    gameId: play.gameId,
    playedAt: formatDate(play.playedAt),
    note: play.note,
    createdAt: play.createdAt.toISOString(),
    updatedAt: play.updatedAt.toISOString(),
  };
}
