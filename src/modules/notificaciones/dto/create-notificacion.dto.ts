import { z } from 'zod';

export const CreateNotificacionDto = z.object({
  idEstudiante: z.number().int().positive().nullable().optional(),
  idDocente: z.number().int().positive().nullable().optional(),
  idAdministrativo: z.number().int().positive().nullable().optional(),
  titulo: z.string().min(1).max(150),
  mensaje: z.string().min(1),
  tipo: z.string().min(1).max(100),
  entidadRelacionada: z.string().max(100).nullable().optional(),
  entidadId: z.number().int().positive().nullable().optional(),
  // Nota: leida y fechaCreacion tienen valores por defecto en el modelo
});

export type CreateNotificacionDto = z.infer<typeof CreateNotificacionDto>;
