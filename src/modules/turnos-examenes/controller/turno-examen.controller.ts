import { Request, Response, NextFunction } from 'express';
import { turnoExamenService } from '../service/turno-examen.service.js';
import { CreateTurnoExamenDto } from '../dto/create-turno-examen.dto.js';
import { UpdateTurnoExamenDto } from '../dto/update-turno-examen.dto.js';
import { respondZodError } from '../../../helpers/respondZodError.js';
import { parsePagination } from '../../../helpers/parsePagination.js';

export const turnoExamenController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await turnoExamenService.getAll(page, limit);
      res.status(200).json({ status: 'success', ...result });
    } catch (err) { next(err); }
  },
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) return res.status(400).json({ status: 'error', message: 'ID inválido.' });
      const turno = await turnoExamenService.getById(id);
      if (!turno) return res.status(404).json({ status: 'error', message: 'TurnoExamen no encontrado.' });
      res.status(200).json({ status: 'success', data: turno });
    } catch (err) { next(err); }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateTurnoExamenDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);
      const nuevo = await turnoExamenService.create(parsed.data);
      res.status(201).json({ status: 'success', data: nuevo });
    } catch (err) { next(err); }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) return res.status(400).json({ status: 'error', message: 'ID inválido.' });
      const parsed = UpdateTurnoExamenDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);
      const actualizado = await turnoExamenService.update(id, parsed.data);
      if (!actualizado) return res.status(404).json({ status: 'error', message: 'TurnoExamen no encontrado.' });
      res.status(200).json({ status: 'success', data: actualizado });
    } catch (err) { next(err); }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) return res.status(400).json({ status: 'error', message: 'ID inválido.' });
      const eliminado = await turnoExamenService.delete(id);
      if (!eliminado) return res.status(404).json({ status: 'error', message: 'TurnoExamen no encontrado.' });
      res.status(204).send();
    } catch (err) { next(err); }
  },
};