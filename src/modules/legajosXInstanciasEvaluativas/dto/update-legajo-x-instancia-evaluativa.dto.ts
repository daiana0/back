import { CreateLegajoXInstanciaEvaluativaDto } from './create-legajo-x-instancia-evaluativa.dto.js';
import { z } from 'zod';

export const UpdateLegajoXInstanciaEvaluativaDto = CreateLegajoXInstanciaEvaluativaDto.partial();
export type UpdateLegajoXInstanciaEvaluativaDto = z.infer<typeof UpdateLegajoXInstanciaEvaluativaDto>;
