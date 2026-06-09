import { Request, Response, NextFunction } from 'express';
import { cursoService } from '../service/curso.service.js';
import { CreateCursoDto } from '../dto/create-curso.dto.js';
import { UpdateCursoDto } from '../dto/update-curso.dto.js';
import { respondZodError } from '../../../helpers/respondZodError.js';
import { parsePagination } from '../../../helpers/parsePagination.js';

export const cursoController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await cursoService.getAll(page, limit);
      res.status(200).json({ status: 'success', ...result });
    } catch (err) { next(err); }
  },
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) return res.status(400).json({ status: 'error', message: 'ID inválido.' });
      const curso = await cursoService.getById(id);
      if (!curso) return res.status(404).json({ status: 'error', message: 'Curso no encontrado.' });
      res.status(200).json({ status: 'success', data: curso });
    } catch (err) { next(err); }
  },
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateCursoDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);
      const nuevo = await cursoService.create(parsed.data);
      res.status(201).json({ status: 'success', data: nuevo });
    } catch (err) { next(err); }
  },
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) return res.status(400).json({ status: 'error', message: 'ID inválido.' });
      const parsed = UpdateCursoDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);
      const actualizado = await cursoService.update(id, parsed.data);
      if (!actualizado) return res.status(404).json({ status: 'error', message: 'Curso no encontrado.' });
      res.status(200).json({ status: 'success', data: actualizado });
    } catch (err) { next(err); }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) return res.status(400).json({ status: 'error', message: 'ID inválido.' });
      const eliminado = await cursoService.delete(id);
      if (!eliminado) return res.status(404).json({ status: 'error', message: 'Curso no encontrado.' });
      res.status(204).send();
    } catch (err) { next(err); }
  },
};