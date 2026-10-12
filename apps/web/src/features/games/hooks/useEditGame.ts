import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateGame } from '@/features/games/api.ts';

export function useEditGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });
}
