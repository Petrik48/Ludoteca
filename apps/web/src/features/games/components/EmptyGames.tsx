import { Plus, LayoutGrid } from 'lucide-react';
import { Button } from '@ludoteca/ui-kit';

interface EmptyGamesProps {
  onCreate: () => void;
}

export function EmptyGames({ onCreate }: EmptyGamesProps) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-20 rounded-xl bg-background">
      <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-muted">
        <LayoutGrid className="text-muted-foreground" size={28} />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <h6 className="text-base font-medium text-secondary-foreground">No games yet</h6>
        <span className="text-sm font-normal text-muted-foreground">
          Add your first game to start building your library.
        </span>
      </div>
      <Button onClick={onCreate}>
        <Plus />
        Add game
      </Button>
    </div>
  );
}
