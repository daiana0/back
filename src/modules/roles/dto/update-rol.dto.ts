import { z } from 'zod';
import { CreateRolDto } from './create-rol.dto.js';

export const UpdateRolDto = CreateRolDto.partial();
export type UpdateRolDto = z.infer<typeof UpdateRolDto>;