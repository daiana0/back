import { CreateInstanciaEvaluativaDto } from './create-instancia-evaluativa.dto.js';
import { z } from 'zod';

export const UpdateInstanciaEvaluativaDto = CreateInstanciaEvaluativaDto.partial();
export type UpdateInstanciaEvaluativaDto = z.infer<typeof UpdateInstanciaEvaluativaDto>;
