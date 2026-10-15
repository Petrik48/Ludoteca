import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@ludoteca/ui-kit';
import { Game } from '../types.ts';
import { useDeleteGame } from '../hooks/useDeleteGame.ts';

interface DeleteGameConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  game: Game;
}

export function DeleteGameConfirm({ open, onOpenChange, game }: DeleteGameConfirmProps) {
  const { mutate, isPending } = useDeleteGame();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete game?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {game.name}? This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {' '}
            {isPending ? 'Loading...' : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => {
              mutate({ id: game.id }, { onSuccess: () => onOpenChange(false) });
            }}
          >
            {isPending ? 'Loading...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
