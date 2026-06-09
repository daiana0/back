import { z } from 'zod';

export const CreateEstudianteXUnidadCurricularDto = z.object({
  idDivisionXUnidadCurricular: z.number().int().positive(),
  idLegajo: z.number().int().positive(),
  fechaDeInscripcion: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Debe tener el formato YYYY-MM-DD'),
  condicion: z.enum(['promocionado', 'regular', 'libre']),
  idAdministrativo: z.number().int().positive(),
});

export type CreateEstudianteXUnidadCurricularDto = z.infer<typeof CreateEstudianteXUnidadCurricularDto>;
