import { useQuery } from '@tanstack/react-query';
import { fetchGame } from '../api.ts';

export function useGame(id: string) {
  return useQuery({
    queryKey: ['games', id],
    queryFn: () => fetchGame(id),
  });
}
