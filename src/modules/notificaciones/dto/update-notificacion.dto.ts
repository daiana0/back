import { CreateNotificacionDto } from './create-notificacion.dto.js';
import { z } from 'zod';

export const UpdateNotificacionDto = CreateNotificacionDto.extend({
    leida: z.boolean().optional(),
}).partial();

export type UpdateNotificacionDto = z.infer<typeof UpdateNotificacionDto>;