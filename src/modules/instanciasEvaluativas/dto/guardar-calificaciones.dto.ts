import { z } from 'zod';

export const GuardarCalificacionesDto = z.object({
  calificaciones: z.array(
    z.object({
      idLegajo: z.number().int().positive('El ID de legajo debe ser un entero positivo'),
      nota: z
        .number()
        .int('La nota debe ser un número entero')
        .min(1, 'La nota mínima es 1')
        .max(10, 'La nota máxima es 10')
        .nullable(),
    })
  ),
});

export type GuardarCalificacionesDto = z.infer<typeof GuardarCalificacionesDto>;
