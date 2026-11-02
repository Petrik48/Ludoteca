import { cn } from '@ludoteca/ui-kit';

interface GameTypeBadgeProps {
  label: string;
  variant: string;
}

export function GameTypeBadge({ label, variant }: GameTypeBadgeProps) {
  return (
    <span className={cn('inline-flex px-2.5 py-0.5 rounded text-xs font-bold uppercase', variant)}>
      {label}
    </span>
  );
}
