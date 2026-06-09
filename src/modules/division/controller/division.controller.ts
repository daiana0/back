import { Request, Response, NextFunction } from "express";
import { divisionService } from "../service/division.service.js";
import { CreateDivisionDto } from "../dto/create-division.dto.js";
import { UpdateDivisionDto } from "../dto/update-division.dto.js";
import type { ZodError } from "zod";

function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function respondZodError(res: Response, error: ZodError): void {
  res.status(400).json({
    status: "error",
    message: "Datos de entrada inválidos.",
    errors: error.flatten().fieldErrors,
  });
}

function parsePagination(query: any) {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  return {
    page: Math.max(1, page),
    limit: Math.max(1, Math.min(100, limit)),
  };
}

export const divisionController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await divisionService.getAll(page, limit);
      res.status(200).json({ status: "success", ...result });
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseId(req.params.id as string);
      if (id === null) {
        return res.status(400).json({
          status: "error",
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }

      const division = await divisionService.getById(id);
      if (!division) {
        return res.status(404).json({
          status: "error",
          message: `No se encontró ninguna división con id ${id}.`,
        });
      }

      res.status(200).json({ status: "success", data: division });
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateDivisionDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }

      const nuevaDivision = await divisionService.create(parsed.data);
      res.status(201).location(`/api/v1/divisiones/${nuevaDivision.id}`).json({
        status: "success",
        data: nuevaDivision,
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseId(req.params.id as string);
      if (id === null) {
        return res.status(400).json({
          status: "error",
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }

      const parsed = UpdateDivisionDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }

      const actualizado = await divisionService.update(id, parsed.data);
      if (!actualizado) {
        return res.status(404).json({
          status: "error",
          message: `No se encontró ninguna división con id ${id}.`,
        });
      }

      res.status(200).json({ status: "success", data: actualizado });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseId(req.params.id as string);
      if (id === null) {
        return res.status(400).json({
          status: "error",
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }

      const eliminado = await divisionService.delete(id);
      if (!eliminado) {
        return res.status(404).json({
          status: "error",
          message: `No se encontró ninguna división con id ${id}.`,
        });
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
