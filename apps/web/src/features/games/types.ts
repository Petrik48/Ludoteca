import type { GameType } from '@ludoteca/types';

export type { GameDto, GameType } from '@ludoteca/types';

export const gameTypeConfig = {
  PUBLISHED: {
    label: 'Published',
    className: 'bg-badge-published text-badge-published-foreground',
  },
  PNP: { label: 'PnP', className: 'bg-badge-pnp text-badge-pnp-foreground' },
} as const satisfies Record<GameType, { label: string; className: string }>;
