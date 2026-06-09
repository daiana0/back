import { z } from 'zod';
import { CreateDocenteDto } from './create-docente.dto.js';

export const UpdateDocenteDto = CreateDocenteDto.partial();

export type UpdateDocenteDto = z.infer<typeof UpdateDocenteDto>;