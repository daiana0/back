import { z } from 'zod';

export const CreateTurnoExamenDto = z.object({
  descripcion: z.string().trim().min(1, 'La descripción es obligatoria'),
  fechaDesde:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(str => new Date(str)),
  fechaHasta:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform(str => new Date(str)),
  idCicloLectivo: z.number().int().positive(),
  idAdministrativo: z.number().int().positive(),
});

export type CreateTurnoExamenDto = z.infer<typeof CreateTurnoExamenDto>;