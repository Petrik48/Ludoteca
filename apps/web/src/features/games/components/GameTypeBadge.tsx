import { cn } from '@ludoteca/ui-kit';
import { GameType, gameTypeConfig } from '../types.ts';

interface GameTypeBadgeProps {
  gameType: GameType;
}

export function GameTypeBadge({ gameType }: GameTypeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex px-2.5 py-0.5 rounded text-xs font-bold uppercase',
        gameTypeConfig[gameType].className,
      )}
    >
      {gameTypeConfig[gameType].label}
    </span>
  );
}
