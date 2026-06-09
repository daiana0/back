import { z } from 'zod';

export const CreateTipoDocumentoDto = z.object({
  idCarrera: z.number().int().positive(),
  nombreDocumento: z.string().min(1).max(100),
  obligatorio: z.boolean().optional().default(true),
  esCritico: z.boolean().optional().default(false),
  descripcion: z.string().nullable().optional(),
  diasVigencia: z.number().int().positive().nullable().optional(),
  idAdministrativo: z.number().int().positive(),
});

export type CreateTipoDocumentoDto = z.infer<typeof CreateTipoDocumentoDto>;