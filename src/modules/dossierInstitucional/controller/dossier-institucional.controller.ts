import { Request, Response, NextFunction } from 'express';
import { dossierInstitucionalService } from '../service/dossier-institucional.service.js';
import { CreateDossierInstitucionalDto } from '../dto/create-dossier-institucional.dto.js';
import { UpdateDossierInstitucionalDto } from '../dto/update-dossier-institucional.dto.js';
import { respondZodError } from '../../../helpers/respondZodError.js';
import { parsePagination } from '../../../helpers/parsePagination.js';

export const dossierInstitucionalController = {
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit } = parsePagination(req.query);
            const result = await dossierInstitucionalService.getAll(page, limit);
            res.status(200).json({ status: 'success', ...result });
        } catch (err) {
            next(err);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ status: 'error', message: 'ID inválido' });
            }
            const dossier = await dossierInstitucionalService.getById(id);
            if (!dossier) {
                return res.status(404).json({ status: 'error', message: `No se encontró el dossier con id ${id}` });
            }
            res.status(200).json({ status: 'success', data: dossier });
        } catch (err) {
            next(err);
        }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = CreateDossierInstitucionalDto.safeParse(req.body);
            if (!parsed.success) return respondZodError(res, parsed.error);
            const nuevo = await dossierInstitucionalService.create(parsed.data);
            res.status(201).location(`/api/v1/dossiers-institucionales/${nuevo.id}`).json({ status: 'success', data: nuevo });
        } catch (err) {
            next(err);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ status: 'error', message: 'ID inválido' });
            }
            const parsed = UpdateDossierInstitucionalDto.safeParse(req.body);
            if (!parsed.success) return respondZodError(res, parsed.error);
            const actualizado = await dossierInstitucionalService.update(id, parsed.data);
            if (!actualizado) {
                return res.status(404).json({ status: 'error', message: `No se encontró el dossier con id ${id}` });
            }
            res.status(200).json({ status: 'success', data: actualizado });
        } catch (err) {
            next(err);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ status: 'error', message: 'ID inválido' });
            }
            const eliminado = await dossierInstitucionalService.delete(id);
            if (!eliminado) {
                return res.status(404).json({ status: 'error', message: `No se encontró el dossier con id ${id}` });
            }
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },
};