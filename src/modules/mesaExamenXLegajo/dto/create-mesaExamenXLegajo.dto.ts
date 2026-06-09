import { z } from 'zod';

export const CreateMesaExamenXLegajoSchema = z.object({
  idMesaExamen: z.number(),
  idLegajo: z.number(),
  condicion: z.enum(["regular", "libre"]),
  fechaInscripcion: z.string().datetime(),
  nota_oral: z.number().min(0).max(10),
  nota_escrita: z.number().min(0).max(10),
  nota_final: z.number().min(0).max(10),
  fechaUltimaModificacion: z.string(),
  resultado: z.enum(["aprobado", "desaprobado", "ausente"]),
  idAdministrativo: z.number(),
  estaBloqueado: z.boolean().optional(),
});

export type CreateMesaExamenXLegajoDto = z.infer<typeof CreateMesaExamenXLegajoSchema>;