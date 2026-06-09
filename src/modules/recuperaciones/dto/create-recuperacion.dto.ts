import { z } from 'zod';

export const CreateRecuperacionDto = z.object({
  idUsuario: z.number().int().positive().nullable().optional(),
  fechaExpiracion: z.coerce.date(),
  fechaUso: z.coerce.date().nullable().optional(),
  idAdministrativo: z.number().int().positive().nullable().optional(),
  idDocente: z.number().int().positive().nullable().optional(),
  // usado tiene defaultValue false, no se incluye en creación
});

export type CreateRecuperacionDto = z.infer<typeof CreateRecuperacionDto>;