
import { z } from 'zod';
import { CreateTipoDocumentoDto } from './create-tipo-documento-requerido.dto.js';

export const UpdateTipoDocumentoDto = CreateTipoDocumentoDto.partial();
export type UpdateTipoDocumentoDto = z.infer<typeof UpdateTipoDocumentoDto>;
