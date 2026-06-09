import { CreateMesaExamenDto } from './create-mesa-examen.dto.js';
import { z } from 'zod';

export const UpdateMesaExamenDto = CreateMesaExamenDto.partial();
export type UpdateMesaExamenDto = z.infer<typeof UpdateMesaExamenDto>;
