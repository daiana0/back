import { z } from 'zod';

export const CreateComprobanteAlumnoDto = z.object({
  idMovimientoFinanciero: z.number(),
  urlComprobante: z.string().url(),
  concepto: z.string().min(1),
  fechaCarga: z.string().datetime().optional(),
  estado: z.enum(["VALIDADO", "NO_VALIDADO"]).optional(),
  fechaConfirmacion: z.string().datetime().nullable().optional(),
  idAdministrativo: z.number().nullable().optional(),
});

export type CreateComprobanteAlumnoDto = z.infer<typeof CreateComprobanteAlumnoDto>;