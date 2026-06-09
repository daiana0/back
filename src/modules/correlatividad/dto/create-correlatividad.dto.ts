import { z } from 'zod';

export const CreateCorrelatividadDto = z.object({
  idPlan: z.number().int().positive(),
  idUnidadCurricular: z.number().int().positive(),
  idUnidadCurricularCorrelativa: z.number().int().positive(),
  condicion: z
    .enum(['REGULARIZADA', 'APROBADA', 'PENDIENTE', 'DESAPROBADA'])
    .optional().default('PENDIENTE'),
});
export type CreateCorrelatividadDto = z.infer<typeof CreateCorrelatividadDto>;
