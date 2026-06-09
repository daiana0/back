
import { z } from 'zod';
import { CreateEquivalenciaDto } from './create-equivalencia-unidad-curricular.dto.js';

export const UpdateEquivalenciaDto = CreateEquivalenciaDto.partial();
export type UpdateEquivalenciaDto = z.infer<typeof UpdateEquivalenciaDto>;
