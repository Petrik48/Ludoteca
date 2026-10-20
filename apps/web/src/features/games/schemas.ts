import { z } from 'zod';
import { GAME_TYPES } from '@ludoteca/types';

export const createGameSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.enum(GAME_TYPES, {
    message: 'Select a game type',
  }),
});

export type CreateGameFormData = z.infer<typeof createGameSchema>;
