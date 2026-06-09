import { z } from 'zod';

export const CreateLegajoXInstanciaEvaluativaDto = z.object({
  idInstanciaEvaluativa: z.number().int().positive(),
  idLegajo: z.number().int().positive(),
  nota: z.number().int().min(0).max(10),
  fechaRegistro: z.string().date('La fecha debe tener formato YYYY-MM-DD'),
  idAdministrativo: z.number().int().positive(),
});

export type CreateLegajoXInstanciaEvaluativaDto = z.infer<typeof CreateLegajoXInstanciaEvaluativaDto>;
