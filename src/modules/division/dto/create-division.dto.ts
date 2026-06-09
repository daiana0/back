import { z } from 'zod';

export const CreateDivisionDto = z.object({
  idDocente: z.number().int().positive('El id del docente debe ser un entero positivo'),
  idCurso: z.number().int().positive('El id del curso debe ser un entero positivo'),
  idAdministrativo: z.number().int().positive('El id del administrativo debe ser un entero positivo'),
});

export type CreateDivisionDto = z.infer<typeof CreateDivisionDto>;
