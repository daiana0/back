import { z } from 'zod';

export const CreateMovimientoFinancieroSchema = z.object({
  idEstudiante: z.number(),
  tipo: z.enum(["INGRESO", "EGRESO"]),
  concepto: z.string().min(1),
  monto: z.number().min(0),
  fecha: z.string().optional(), // Zod valida strings, Sequelize maneja la conversión a Date
  medioPago: z.string().min(1),
  descripcion: z.string().nullable().optional(),
  idAdministrativo: z.number(),
});

export type CreateMovimientoFinancieroDto = z.infer<typeof CreateMovimientoFinancieroSchema>;