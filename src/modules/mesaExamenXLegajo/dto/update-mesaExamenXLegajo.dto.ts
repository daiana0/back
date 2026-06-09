import { z } from 'zod';
import { CreateMesaExamenXLegajoSchema } from './create-mesaExamenXLegajo.dto.js';

// .partial() toma el esquema de creación y vuelve todos sus campos opcionales
export const UpdateMesaExamenXLegajoSchema = CreateMesaExamenXLegajoSchema.partial();

export type UpdateMesaExamenXLegajoDto = z.infer<typeof UpdateMesaExamenXLegajoSchema>;