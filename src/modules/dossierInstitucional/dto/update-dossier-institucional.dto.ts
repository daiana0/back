import { CreateDossierInstitucionalDto } from './create-dossier-institucional.dto.js';
import { z } from 'zod';

export const UpdateDossierInstitucionalDto = CreateDossierInstitucionalDto.partial();
export type UpdateDossierInstitucionalDto = z.infer<typeof UpdateDossierInstitucionalDto>;