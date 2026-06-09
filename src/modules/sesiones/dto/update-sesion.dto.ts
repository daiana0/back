import { CreateSesionDto } from './create-sesion.dto.js';
import { z } from 'zod';

export const UpdateSesionDto = CreateSesionDto.extend({
    fechaInicioSesion: z.coerce.date().optional(),
}).partial();

export type UpdateSesionDto = z.infer<typeof UpdateSesionDto>;