import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button, ToggleGroupItem, ToggleGroup } from '@ludoteca/ui-kit';
import { GamesTable } from '../components/GamesTable';
import { useGames } from '../hooks/useGames';
import { EmptyGames } from '../components/EmptyGames';
import { AddGameDialog } from '../components/AddGameDialog.tsx';
import { EditGameDialog } from '../components/EditGameDialog.tsx';
import { Game } from '../types.ts';

export default function GamesLibraryPage() {
  const { data: games, isLoading, error } = useGames();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  const handleEdit = (game: Game) => {
    setEditingGame(game);
  };

  const handleDelete = (game: Game) => {
    console.log('delete', game.id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading games</div>;

  return (
    <div className="flex flex-col gap-8 w-[960px] mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-foreground">Ludoteca</h1>
          <span className="text-xs text-muted-foreground">5 games</span>
        </div>
        {!!games?.length && (
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus />
            Add game
          </Button>
        )}
      </div>
      <ToggleGroup defaultValue={['all']} variant="outline">
        <ToggleGroupItem value="all">all</ToggleGroupItem>
        <ToggleGroupItem value="Published">Published</ToggleGroupItem>
        <ToggleGroupItem value="PnP">PnP</ToggleGroupItem>
      </ToggleGroup>
      {games && games.length ? (
        <GamesTable games={games ?? []} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <EmptyGames onCreate={() => setIsCreateOpen(true)} />
      )}
      <AddGameDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      {editingGame && (
        <EditGameDialog
          open
          onOpenChange={(open) => {
            if (!open) setEditingGame(null);
          }}
          game={editingGame!}
        />
      )}
    </div>
  );
}
