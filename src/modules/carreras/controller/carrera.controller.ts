import { Request, Response, NextFunction } from "express";
import { carreraService } from "../service/carrera.service.js";
import { CreateCarreraDto } from "../dto/create-carrera.dto.js";
import { UpdateCarreraDto } from "../dto/update-carrera.dto.js";
import { respondZodError } from "../../../helpers/respondZodError.js";
import { parsePagination } from "../../../helpers/parsePagination.js";

export const carreraController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const nombre = req.query.nombre as string | undefined;
      const result = await carreraService.getAll(page, limit, { nombre });
      res.status(200).json({ status: "success", ...result });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) return res.status(400).json({ status: "error", message: "ID inválido" });
      const carrera = await carreraService.getById(id);
      if (!carrera) return res.status(404).json({ status: "error", message: "Carrera no encontrada" });
      res.status(200).json({ status: "success", data: carrera });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateCarreraDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);
      const nueva = await carreraService.create(parsed.data);
      res.status(201).location(`/api/v1/carreras/${nueva.id}`).json({ status: "success", data: nueva });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) return res.status(400).json({ status: "error", message: "ID inválido" });
      const parsed = UpdateCarreraDto.safeParse(req.body);
      if (!parsed.success) return respondZodError(res, parsed.error);
      const actualizada = await carreraService.update(id, parsed.data);
      if (!actualizada) return res.status(404).json({ status: "error", message: "Carrera no encontrada" });
      res.status(200).json({ status: "success", data: actualizada });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) return res.status(400).json({ status: "error", message: "ID inválido" });
      const eliminada = await carreraService.delete(id);
      if (!eliminada) return res.status(404).json({ status: "error", message: "Carrera no encontrada" });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};