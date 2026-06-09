import { CreateInformacionExtraDto } from './create-informacion-extra.dto.js';
import { z } from 'zod';

export const UpdateInformacionExtraDto = CreateInformacionExtraDto.partial();
export type UpdateInformacionExtraDto = z.infer<typeof UpdateInformacionExtraDto>;