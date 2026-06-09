import { CreateCorrelatividadDto } from './create-correlatividad.dto.js';
import { z } from 'zod';

export const UpdateCorrelatividadDto = CreateCorrelatividadDto.partial();
export type UpdateCorrelatividadDto = z.infer<typeof UpdateCorrelatividadDto>;
