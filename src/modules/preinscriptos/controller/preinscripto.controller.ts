import { Request, Response, NextFunction } from 'express';
import { preinscriptoService } from '../service/preinscripto.service.js';
import { CreatePreinscriptoDto } from '../dto/create-preinscripto.dto.js';
import { UpdatePreinscriptoDto } from '../dto/update-preinscripto.dto.js';
import { respondZodError } from '../../../helpers/respondZodError.js';
import { parsePagination } from '../../../helpers/parsePagination.js';

export const preinscriptoController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await preinscriptoService.getAll(page, limit);
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
      const entity = await preinscriptoService.getById(id);
      if (!entity) {
        return res.status(404).json({ status: 'error', message: `No se encontró preinscripto con id ${id}` });
      }
      res.status(200).json({ status: 'success', data: entity });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreatePreinscriptoDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);
      const nuevo = await preinscriptoService.create(parsed.data);
      res.status(201).location(`/api/v1/preinscriptos/${nuevo.id}`).json({ status: 'success', data: nuevo });
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
      const parsed = UpdatePreinscriptoDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);
      const actualizado = await preinscriptoService.update(id, parsed.data);
      if (!actualizado) {
        return res.status(404).json({ status: 'error', message: `No se encontró preinscripto con id ${id}` });
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
      const eliminado = await preinscriptoService.delete(id);
      if (!eliminado) {
        return res.status(404).json({ status: 'error', message: `No se encontró preinscripto con id ${id}` });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
  getMine: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idUsuario = (req as any).user?.id;
      if (!idUsuario) {
        return res.status(401).json({ status: 'error', message: 'No autenticado' });
      }
      const rows = await preinscriptoService.getByUsuario(idUsuario);
      res.status(200).json({ status: 'success', data: rows });
    } catch (err) {
      next(err);
    }
  },
};