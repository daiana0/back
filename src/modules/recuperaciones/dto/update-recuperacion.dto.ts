import { CreateRecuperacionDto } from './create-recuperacion.dto.js';
import { z } from 'zod';

export const UpdateRecuperacionDto = CreateRecuperacionDto.extend({
    usado: z.boolean().optional(),
}).partial();

export type UpdateRecuperacionDto = z.infer<typeof UpdateRecuperacionDto>;