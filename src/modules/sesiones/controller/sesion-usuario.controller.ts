import { Request, Response, NextFunction } from 'express';
import { CreateSesionDto } from '../dto/create-sesion.dto.js';
import { UpdateSesionDto } from '../dto/update-sesion.dto.js';
import { parsePagination } from '../../../helpers/parsePagination.js';
import { respondZodError } from '../../../helpers/respondZodError.js';
import { sesionService } from '../service/sesion-usuario.service.js';

export const sesionController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await sesionService.getAll(page, limit);
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
      const sesion = await sesionService.getById(id);
      res.status(200).json({ status: 'success', data: sesion });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateSesionDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const nueva = await sesionService.create(parsed.data);
      res
        .status(201)
        .location(`/api/v1/sesiones/${nueva.id}`)
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
      const parsed = UpdateSesionDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const actualizada = await sesionService.update(id, parsed.data);
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
      await sesionService.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};