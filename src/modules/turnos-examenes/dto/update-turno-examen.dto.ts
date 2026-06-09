import { CreateTurnoExamenDto } from './create-turno-examen.dto.js';
import { z } from 'zod';

export const UpdateTurnoExamenDto = CreateTurnoExamenDto.partial();
export type UpdateTurnoExamenDto = z.infer<typeof UpdateTurnoExamenDto>;