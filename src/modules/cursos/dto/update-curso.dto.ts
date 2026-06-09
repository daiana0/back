import { CreateCursoDto } from './create-curso.dto.js';
import { z } from 'zod';

export const UpdateCursoDto = CreateCursoDto.partial();
export type UpdateCursoDto = z.infer<typeof UpdateCursoDto>;