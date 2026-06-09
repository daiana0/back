import { CreateLegajoDto } from './create-legajo.dto.js';
import { z } from 'zod';

export const UpdateLegajoDto = CreateLegajoDto.partial();
export type UpdateLegajoDto = z.infer<typeof UpdateLegajoDto>;