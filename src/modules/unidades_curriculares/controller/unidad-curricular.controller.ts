import { Request, Response, NextFunction } from "express";
import { unidadCurricularService } from "../service/unidad-curricular.service.js";
import { CreateUnidadCurricularDto } from "../dto/create-unidad-curricular.dto.js";
import { UpdateUnidadCurricularDto } from "../dto/update-unidad-curricular.dto.js";
import { respondZodError } from "../../../helpers/respondZodError.js";
import { parsePagination } from "../../../helpers/parsePagination.js";

export const unidadCurricularController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const filters = {
        idPlanEstudio: req.query.idPlanEstudio ? Number(req.query.idPlanEstudio) : undefined,
        nombre: req.query.nombre as string | undefined,
        duracion: req.query.duracion as "anual" | "cuatrimestral" | undefined,
      };
      const result = await unidadCurricularService.getAll(page, limit, filters);
      res.status(200).json({ status: "success", ...result });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) return res.status(400).json({ status: "error", message: "ID inválido" });
      const uc = await unidadCurricularService.getById(id);
      if (!uc) return res.status(404).json({ status: "error", message: "Unidad curricular no encontrada" });
      res.status(200).json({ status: "success", data: uc });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateUnidadCurricularDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);
      const nueva = await unidadCurricularService.create(parsed.data);
      res.status(201).location(`/api/v1/unidades-curriculares/${nueva.id}`).json({ status: "success", data: nueva });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) return res.status(400).json({ status: "error", message: "ID inválido" });
      const parsed = UpdateUnidadCurricularDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);
      const actualizada = await unidadCurricularService.update(id, parsed.data);
      if (!actualizada) return res.status(404).json({ status: "error", message: "Unidad curricular no encontrada" });
      res.status(200).json({ status: "success", data: actualizada });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) return res.status(400).json({ status: "error", message: "ID inválido" });
      const eliminada = await unidadCurricularService.delete(id);
      if (!eliminada) return res.status(404).json({ status: "error", message: "Unidad curricular no encontrada" });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};