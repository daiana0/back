import { z } from 'zod';

export const CreateSesionDto = z.object({
  idUsuario: z.number().int().positive().nullable().optional(),
  fechaCierreSesion: z.coerce.date().nullable().optional(),
  intentoFallido: z.number().int().min(0).optional(), // tiene defaultValue 0
  bloqueado: z.boolean().optional(), // defaultValue false
  idAdministrativo: z.number().int().positive().nullable().optional(),
  idDocente: z.number().int().positive().nullable().optional(),
  // fechaInicioSesion tiene defaultValue NOW, no se incluye
});

export type CreateSesionDto = z.infer<typeof CreateSesionDto>;