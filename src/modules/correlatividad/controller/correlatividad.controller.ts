import { Request, Response, NextFunction } from 'express';
import { CorrelatividadService } from '../service/correlatividad.service.js';
import { CreateCorrelatividadDto } from '../dto/create-correlatividad.dto.js';
import { UpdateCorrelatividadDto } from '../dto/update-correlatividad.dto.js';
import { parsePagination } from '../../../helpers/parsePagination.js';
import { respondZodError } from '../../../helpers/respondZodError.js';



export const CorrelatividadController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const nombre = req.query.nombre as string | undefined;
      const result = await CorrelatividadService.getAll(page, limit, { nombre });
      res.status(200).json({ status: "success", ...result });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) return res.status(400).json({ status: "error", message: "ID inválido" });
      const correlatividad = await CorrelatividadService.getById(id);
      if (!correlatividad) return res.status(404).json({ status: "error", message: "correlatividad no encontrada" });
      res.status(200).json({ status: "success", data: correlatividad });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateCorrelatividadDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);
      const nueva = await CorrelatividadService.create(parsed.data);
      res.status(201).location(`/api/v1/correlatividades/${nueva.id}`).json({ status: "success", data: nueva });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) return res.status(400).json({ status: "error", message: "ID inválido" });
      const parsed = UpdateCorrelatividadDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);
      const actualizada = await CorrelatividadService.update(id, parsed.data);
      if (!actualizada) return res.status(404).json({ status: "error", message: "Correlatividad no encontrada" });
      res.status(200).json({ status: "success", data: actualizada });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) return res.status(400).json({ status: "error", message: "ID inválido" });
      const eliminada = await CorrelatividadService.delete(id);
      if (!eliminada) return res.status(404).json({ status: "error", message: "correlatividad no encontrada" });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
}
