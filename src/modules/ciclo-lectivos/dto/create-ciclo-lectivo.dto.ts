import { z } from 'zod';

export const CreateCicloLectivoDto = z.object({
  anio: z.number().int().positive(),
  activo: z.boolean().optional().default(true),
  fechaInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fechaFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  idPlanEstudio: z.number().int().positive(),
  idAdministrativo: z.number().int().positive(),
});

export type CreateCicloLectivoDto = z.infer<typeof CreateCicloLectivoDto>;