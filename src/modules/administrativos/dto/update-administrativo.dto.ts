import { CreateAdministrativoDto } from './create-administrativo.dto.js';
import { z } from 'zod';

export const UpdateAdministrativoDto = CreateAdministrativoDto.partial();
export type UpdateAdministrativoDto = z.infer<typeof UpdateAdministrativoDto>;