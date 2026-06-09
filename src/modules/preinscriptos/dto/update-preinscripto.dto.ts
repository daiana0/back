import { CreatePreinscriptoDto } from './create-preinscripto.dto.js';
import { z } from 'zod';

export const UpdatePreinscriptoDto = CreatePreinscriptoDto.partial();
export type UpdatePreinscriptoDto = z.infer<typeof UpdatePreinscriptoDto>;