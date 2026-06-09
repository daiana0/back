import { Request, Response, NextFunction } from 'express';
import { informacionExtraService } from '../service/informacion-extra.service.js';
import { CreateInformacionExtraDto } from '../dto/create-informacion-extra.dto.js';
import { UpdateInformacionExtraDto } from '../dto/update-informacion-extra.dto.js';
import { respondZodError } from '../../../helpers/respondZodError.js';
import { parsePagination } from '../../../helpers/parsePagination.js';

export const informacionExtraController = {
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit } = parsePagination(req.query);
            const result = await informacionExtraService.getAll(page, limit);
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
            const info = await informacionExtraService.getById(id);
            if (!info) {
                return res.status(404).json({ status: 'error', message: `No se encontró información extra con id ${id}` });
            }
            res.status(200).json({ status: 'success', data: info });
        } catch (err) {
            next(err);
        }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = CreateInformacionExtraDto.safeParse(req.body);
            if (!parsed.success) return respondZodError(res, parsed.error);
            const nuevo = await informacionExtraService.create(parsed.data);
            res.status(201).location(`/api/v1/informacion-extra/${nuevo.id}`).json({ status: 'success', data: nuevo });
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
            const parsed = UpdateInformacionExtraDto.safeParse(req.body);
            if (!parsed.success) return respondZodError(res, parsed.error);
            const actualizado = await informacionExtraService.update(id, parsed.data);
            if (!actualizado) {
                return res.status(404).json({ status: 'error', message: `No se encontró información extra con id ${id}` });
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
            const eliminado = await informacionExtraService.delete(id);
            if (!eliminado) {
                return res.status(404).json({ status: 'error', message: `No se encontró información extra con id ${id}` });
            }
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },
};