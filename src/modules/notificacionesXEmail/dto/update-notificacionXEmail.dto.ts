import { CreateNotificacionXEmailDto } from './create-notificacionXEmail.dto.js';
import { z } from 'zod';

export const UpdateNotificacionXEmailDto = CreateNotificacionXEmailDto.extend({
    enviado: z.boolean().optional(),
    prioridad: z.enum(['baja', 'media', 'alta']).optional(),
}).partial();

export type UpdateNotificacionXEmailDto = z.infer<typeof UpdateNotificacionXEmailDto>;