import { CreateInscripcionCarreraDto } from './create-inscripcion-carrera.dto.js';
import { z } from 'zod';

export const UpdateInscripcionCarreraDto = CreateInscripcionCarreraDto.partial();
export type UpdateInscripcionCarreraDto = z.infer<typeof UpdateInscripcionCarreraDto>;