import { Plus } from 'lucide-react';
import { Button } from '@ludoteca/ui-kit';
import emptyGamesImg from '@/assets/images/empty-games.png';

interface EmptyGamesProps {
  onCreate: () => void;
}

export function EmptyGames({ onCreate }: EmptyGamesProps) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-20 rounded-xl bg-background">
      <img src={emptyGamesImg} alt="" width="180" height="180" decoding="async" />
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-base font-medium text-secondary-foreground">No games yet</p>
        <span className="text-sm font-normal text-muted-foreground">
          Add your first board game to start building your collection.
        </span>
      </div>
      <Button onClick={onCreate}>
        <Plus />
        Add game
      </Button>
    </div>
  );
}
