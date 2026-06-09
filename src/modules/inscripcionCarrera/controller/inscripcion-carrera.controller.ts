import { Request, Response, NextFunction } from 'express';
import { inscripcionCarreraService } from '../service/inscripcion-carrera.service.js';
import { CreateInscripcionCarreraDto } from '../dto/create-inscripcion-carrera.dto.js';
import { UpdateInscripcionCarreraDto } from '../dto/update-inscripcion-carrera.dto.js';
import { respondZodError } from '../../../helpers/respondZodError.js';
import { parsePagination } from '../../../helpers/parsePagination.js';

export const inscripcionCarreraController = {
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit } = parsePagination(req.query);
            const result = await inscripcionCarreraService.getAll(page, limit);
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
            const inscripcion = await inscripcionCarreraService.getById(id);
            if (!inscripcion) {
                return res.status(404).json({ status: 'error', message: `No se encontró inscripción con id ${id}` });
            }
            res.status(200).json({ status: 'success', data: inscripcion });
        } catch (err) {
            next(err);
        }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = CreateInscripcionCarreraDto.safeParse(req.body);
            if (!parsed.success) return respondZodError(res, parsed.error);
            const nueva = await inscripcionCarreraService.create(parsed.data);
            res.status(201).location(`/api/v1/inscripciones-carreras/${nueva.id}`).json({ status: 'success', data: nueva });
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
            const parsed = UpdateInscripcionCarreraDto.safeParse(req.body);
            if (!parsed.success) return respondZodError(res, parsed.error);
            const actualizada = await inscripcionCarreraService.update(id, parsed.data);
            if (!actualizada) {
                return res.status(404).json({ status: 'error', message: `No se encontró inscripción con id ${id}` });
            }
            res.status(200).json({ status: 'success', data: actualizada });
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
            const eliminada = await inscripcionCarreraService.delete(id);
            if (!eliminada) {
                return res.status(404).json({ status: 'error', message: `No se encontró inscripción con id ${id}` });
            }
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },
};