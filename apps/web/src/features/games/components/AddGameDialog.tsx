import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@ludoteca/ui-kit';
import { GameForm } from '../components/GameForm.tsx';
import { useCreateGame } from '../hooks/useCreateGame.ts';

interface AddGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddGameDialog({ open, onOpenChange }: AddGameDialogProps) {
  const createGame = useCreateGame();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add game</DialogTitle>
        </DialogHeader>
        <GameForm
          onSubmit={(data) => {
            createGame.mutate(data, {
              onSuccess: () => onOpenChange(false),
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
