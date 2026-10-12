import { z } from 'zod';

export const createGameSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  type: z.enum(['PUBLISHED', 'PNP'], {
    message: 'Select a game type',
  }),
});

export type CreateGameFormData = z.infer<typeof createGameSchema>;
