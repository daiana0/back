import { z } from 'zod';
import { CreateMovimientoFinancieroSchema } from './create-movimientoFinanciero.dto.js';

export const UpdateMovimientoFinancieroSchema = CreateMovimientoFinancieroSchema.partial();

export type UpdateMovimientoFinancieroDto = z.infer<typeof UpdateMovimientoFinancieroSchema>;