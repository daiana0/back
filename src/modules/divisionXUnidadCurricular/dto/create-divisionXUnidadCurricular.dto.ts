import { z } from 'zod';

export const CreateDivisionXUnidadCurricularDto = z.object({
  idDivision: z.number().int().positive('El id de la división debe ser un entero positivo'),
  idUnidadCurricular: z.number().int().positive('El id de la unidad curricular debe ser un entero positivo'),
  idAdministrativo: z.number().int().positive('El id del administrativo debe ser un entero positivo'),
});

export type CreateDivisionXUnidadCurricularDto = z.infer<typeof CreateDivisionXUnidadCurricularDto>;
