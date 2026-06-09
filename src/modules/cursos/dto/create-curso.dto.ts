import { z } from 'zod';

export const CreateCursoDto = z.object({
  cupoEstudiantes: z.number().int().min(0).nullable().optional(),
  anioAcademico: z.number().int().positive(),
  idCicloLectivo: z.number().int().positive(),
  idAdministrativo: z.number().int().positive(),
});

export type CreateCursoDto = z.infer<typeof CreateCursoDto>;