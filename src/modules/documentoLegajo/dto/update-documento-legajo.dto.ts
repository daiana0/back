import { CreateDocumentoLegajoDto } from './create-documento-legajo.dto.js';
import { z } from 'zod';

export const UpdateDocumentoLegajoDto = CreateDocumentoLegajoDto.partial();
export type UpdateDocumentoLegajoDto = z.infer<typeof UpdateDocumentoLegajoDto>;
