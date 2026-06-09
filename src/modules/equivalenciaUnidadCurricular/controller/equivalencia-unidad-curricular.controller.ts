import { Request, Response, NextFunction } from 'express';
import { parsePagination } from '../../../helpers/parsePagination.js';
import { respondZodError } from '../../../helpers/respondZodError.js';
import { equivalenciaService } from '../service/equivalencia-unidad-curricular.service.js';
import { CreateEquivalenciaDto } from '../dto/create-equivalencia-unidad-curricular.dto.js';
import { UpdateEquivalenciaDto } from '../dto/update-equivalencia-unidad-curricular.dto.js';

export const equivalenciaController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await equivalenciaService.getAll(page, limit);
      res.status(200).json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const eq = await equivalenciaService.getById(id);
      res.status(200).json({ status: 'success', data: eq });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateEquivalenciaDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const nueva = await equivalenciaService.create(parsed.data);
      res
        .status(201)
        .location(`/api/v1/equivalencias/${nueva.id}`)
        .json({ status: 'success', data: nueva });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const parsed = UpdateEquivalenciaDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const actualizada = await equivalenciaService.update(id, parsed.data);
      res.status(200).json({ status: 'success', data: actualizada });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      await equivalenciaService.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};