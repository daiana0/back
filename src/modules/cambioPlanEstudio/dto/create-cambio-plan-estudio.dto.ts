import { z } from 'zod';

export const CreateCambioPlanEstudioDto = z.object({
  idLegajo: z.number().int().positive(),
  idPlanEstudioOrigen: z.number().int().positive(),
  idPlanEstudioDestino: z.number().int().positive(),
  idUsuarioGestor: z.number().int().positive(),
  fechaSolicitud: z.string().date('YYYY-MM-DD').optional(), // si no se envía, el modelo usa defaultValue
  fechaAprobacion: z.string().date('YYYY-MM-DD').nullable().optional(),
  plazoVencimiento: z.string().date('YYYY-MM-DD').nullable().optional(),
  estado: z.enum(['PENDIENTE', 'APROBADO', 'RECHAZADO']).default('PENDIENTE'),
  observaciones: z.string().nullable().optional(),
  idAdministrativo: z.number().int().positive(),
});

export type CreateCambioPlanEstudioDto = z.infer<typeof CreateCambioPlanEstudioDto>;