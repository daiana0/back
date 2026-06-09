// src/modules/ciclo-lectivos/dto/update-ciclo-lectivo.dto.ts
import { CreateCicloLectivoDto } from './create-ciclo-lectivo.dto.js';
import { z } from 'zod';

export const UpdateCicloLectivoDto = CreateCicloLectivoDto.partial();
export type UpdateCicloLectivoDto = z.infer<typeof UpdateCicloLectivoDto>;