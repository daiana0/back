import { CreateCambioPlanEstudioDto } from './create-cambio-plan-estudio.dto.js';
import { z } from 'zod';

export const UpdateCambioPlanEstudioDto = CreateCambioPlanEstudioDto.partial();
export type UpdateCambioPlanEstudioDto = z.infer<typeof UpdateCambioPlanEstudioDto>;