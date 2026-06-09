import { CreateEstudianteDto } from './create-estudiante.dto.js';
import { z } from 'zod';

export const UpdateEstudianteDto = CreateEstudianteDto.partial();
export type UpdateEstudianteDto = z.infer<typeof UpdateEstudianteDto>;