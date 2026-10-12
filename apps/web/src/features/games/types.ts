export const gameTypeConfig = {
  PUBLISHED: {
    label: 'Published',
    className: 'bg-badge-published text-badge-published-foreground',
  },
  PNP: { label: 'PnP', className: 'bg-badge-pnp text-badge-pnp-foreground' },
} as const satisfies Record<string, { label: string; className: string }>;

export type GameType = keyof typeof gameTypeConfig;

export interface Game {
  id: string;
  name: string;
  type: GameType;
  bggId: number | null;
  createdAt: string;
  updatedAt: string;
}
