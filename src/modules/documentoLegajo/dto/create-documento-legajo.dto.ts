import { z } from 'zod';

export const CreateDocumentoLegajoDto = z.object({
  idLegajo: z.number().int().positive(),
  idTipoDocumentoRequerido: z.number().int().positive(),
  idUsuarioCarga: z.number().int().positive(),
  urlArchivo: z.string().url().max(500),
  fechaVencimiento: z.date().nullable().optional(),
  idAdministrativo: z.number().int().positive(),
});

export type CreateDocumentoLegajoDto = z.infer<typeof CreateDocumentoLegajoDto>;
