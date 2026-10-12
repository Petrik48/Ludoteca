import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@ludoteca/ui-kit';
import { GameForm } from '../components/GameForm.tsx';
import { useEditGame } from '../hooks/useEditGame.ts';
import { Game } from '../types.ts';

interface EditGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  game: Game;
}

export function EditGameDialog({ open, onOpenChange, game }: EditGameDialogProps) {
  const editGame = useEditGame();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit game</DialogTitle>
        </DialogHeader>
        <GameForm
          submitLabel="Edit"
          defaultValues={{ name: game.name, type: game.type }}
          onSubmit={(data) => {
            editGame.mutate({ id: game.id, data }, { onSuccess: () => onOpenChange(false) });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
