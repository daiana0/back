import { CreateDivisionDto } from './create-division.dto.js';
import { z } from 'zod';

export const UpdateDivisionDto = CreateDivisionDto.partial();

export type UpdateDivisionDto = z.infer<typeof UpdateDivisionDto>;
