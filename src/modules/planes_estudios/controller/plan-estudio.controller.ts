import { Request, Response, NextFunction } from "express";
import { planEstudioService } from "../service/plan-estudio.service.js";
import { CreatePlanEstudioDto } from "../dto/create-plan-estudio.dto.js";
import { UpdatePlanEstudioDto } from "../dto/update-plan-estudio.dto.js";
import { respondZodError } from "../../../helpers/respondZodError.js";
import { parsePagination } from "../../../helpers/parsePagination.js";

export const planEstudioController = {
  // GET /plan-estudios?page=&limit=&idCarrera=&version=&estado=
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const filters = {
        idCarrera: req.query.idCarrera ? Number(req.query.idCarrera) : undefined,
        version: req.query.version as string | undefined,
        estado: req.query.estado as string | undefined,
      };
      const result = await planEstudioService.getAll(page, limit, filters);
      res.status(200).json({ status: "success", ...result });
    } catch (err) {
      next(err);
    }
  },

  // GET /plan-estudios/:id
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ status: "error", message: "ID inválido" });
      }
      const plan = await planEstudioService.getById(id);
      if (!plan) {
        return res.status(404).json({ status: "error", message: "Plan de estudio no encontrado" });
      }
      res.status(200).json({ status: "success", data: plan });
    } catch (err) {
      next(err);
    }
  },

  // POST /plan-estudios
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreatePlanEstudioDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);

      const nuevo = await planEstudioService.create(parsed.data);
      res
        .status(201)
        .location(`/api/v1/plan-estudios/${nuevo.id}`)
        .json({ status: "success", data: nuevo });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /plan-estudios/:id
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ status: "error", message: "ID inválido" });
      }
      const parsed = UpdatePlanEstudioDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);

      const actualizado = await planEstudioService.update(id, parsed.data);
      if (!actualizado) {
        return res.status(404).json({ status: "error", message: "Plan de estudio no encontrado" });
      }
      res.status(200).json({ status: "success", data: actualizado });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /plan-estudios/:id
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ status: "error", message: "ID inválido" });
      }
      const eliminado = await planEstudioService.delete(id);
      if (!eliminado) {
        return res.status(404).json({ status: "error", message: "Plan de estudio no encontrado" });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};