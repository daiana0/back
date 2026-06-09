import { Request, Response, NextFunction } from 'express';
import { cambioPlanEstudioService } from '../service/cambio-plan-estudio.service.js';
import { CreateCambioPlanEstudioDto } from '../dto/create-cambio-plan-estudio.dto.js';
import { UpdateCambioPlanEstudioDto } from '../dto/update-cambio-plan-estudio.dto.js';
import { respondZodError } from '../../../helpers/respondZodError.js';
import { parsePagination } from '../../../helpers/parsePagination.js';

export const cambioPlanEstudioController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await cambioPlanEstudioService.getAll(page, limit);
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
      const entity = await cambioPlanEstudioService.getById(id);
      if (!entity) {
        return res.status(404).json({ status: 'error', message: `No se encontró el registro con id ${id}` });
      }
      res.status(200).json({ status: 'success', data: entity });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateCambioPlanEstudioDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);
      const nuevo = await cambioPlanEstudioService.create(parsed.data);
      res.status(201).location(`/api/v1/cambios-plan-estudio/${nuevo.id}`).json({ status: 'success', data: nuevo });
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
      const parsed = UpdateCambioPlanEstudioDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);
      const actualizado = await cambioPlanEstudioService.update(id, parsed.data);
      if (!actualizado) {
        return res.status(404).json({ status: 'error', message: `No se encontró el registro con id ${id}` });
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
      const eliminado = await cambioPlanEstudioService.delete(id);
      if (!eliminado) {
        return res.status(404).json({ status: 'error', message: `No se encontró el registro con id ${id}` });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};