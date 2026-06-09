import { z } from 'zod';
import { CreateComprobanteAlumnoDto } from './create-comprobanteAlumno.dto.js';

export const UpdateComprobanteAlumnoDto = CreateComprobanteAlumnoDto.partial();

export type UpdateComprobanteAlumnoDto = z.infer<typeof UpdateComprobanteAlumnoDto>;