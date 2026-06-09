import { z } from 'zod';
import { CreateUsuarioDto } from './create-usuario.dto.js';

export const UpdateUsuarioDto = CreateUsuarioDto.partial();

export type UpdateUsuarioDto = z.infer<typeof UpdateUsuarioDto>;