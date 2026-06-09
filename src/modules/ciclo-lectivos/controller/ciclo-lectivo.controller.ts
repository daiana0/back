import { Request, Response, NextFunction } from 'express';
import { cicloLectivoService } from '../service/ciclo-lectivo.service.js';
import { CreateCicloLectivoDto } from '../dto/create-ciclo-lectivo.dto.js';
import { UpdateCicloLectivoDto } from '../dto/update-ciclo-lectivo.dto.js';
import { respondZodError } from '../../../helpers/respondZodError.js';
import { parsePagination } from '../../../helpers/parsePagination.js';
import {AppError} from '../../../core/middlewares/error-handler.middleware.js';
import CicloLectivo from '../model/CicloLectivo.js';

export const cicloLectivoController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await cicloLectivoService.getAll(page, limit);
      res.status(200).json({ status: 'success', ...result });
    } catch (err) { next(err); }
  },
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) return res.status(400).json({ status: 'error', message: 'ID inválido.' });
      const ciclo = await cicloLectivoService.getById(id);
      if (!ciclo) return res.status(404).json({ status: 'error', message: 'CicloLectivo no encontrado.' });
      res.status(200).json({ status: 'success', data: ciclo });
    } catch (err) { next(err); }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateCicloLectivoDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);
      const nuevo = await cicloLectivoService.create(parsed.data);
      res.status(201).json({ status: 'success', data: nuevo });
    } catch (err) { next(err); }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) return res.status(400).json({ status: 'error', message: 'ID inválido.' });
      const parsed = UpdateCicloLectivoDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);
      const actualizado = await cicloLectivoService.update(id, parsed.data);
      if (!actualizado) return res.status(404).json({ status: 'error', message: 'CicloLectivo no encontrado.' });
      res.status(200).json({ status: 'success', data: actualizado });
    } catch (err) { next(err); }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) return res.status(400).json({ status: 'error', message: 'ID inválido.' });
      const eliminado = await cicloLectivoService.delete(id);
      if (!eliminado) return res.status(404).json({ status: 'error', message: 'CicloLectivo no encontrado.' });
      res.status(204).send();
    } catch (err) { next(err); }
  },

  async getActivo(req: Request, res: Response, next: NextFunction) {
  try {
    const ciclo = await CicloLectivo.findOne({ where: { activo: true } });
    if (!ciclo) throw new AppError('No hay ciclo lectivo activo', 404);
    res.json({ status: 'success', data: { anio: ciclo.anio } });
  } catch (err) { next(err); }
}
};