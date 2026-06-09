import { z } from 'zod';

export const CreateNotificacionXEmailDto = z.object({
  emisor: z.string().email().min(1).max(150),
  receptor: z.string().email().min(1).max(150),
  asunto: z.string().min(1).max(150),
  mensaje: z.string(),
  enviado: z.boolean().optional().default(false),
  prioridad: z.enum(['baja', 'media', 'alta']).optional().default('baja'),
});

export type CreateNotificacionXEmailDto = z.infer<typeof CreateNotificacionXEmailDto>;
