import { Request, Response, NextFunction } from 'express';
import { estudianteXUnidadCurricularService } from '../service/estudianteXUnidadCurricular.service.js';
import { CreateEstudianteXUnidadCurricularDto } from '../dto/create-estudianteXUnidadCurricular.dto.js';
import { UpdateEstudianteXUnidadCurricularDto } from '../dto/update-estudianteXUnidadCurricular.dto.js';
import type { ZodError } from 'zod';

// ─── Helpers ─────────────────────────────────────────
function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function respondZodError(res: Response, error: ZodError): void {
  res.status(400).json({
    status: 'error',
    message: 'Datos de entrada inválidos.',
    errors: error.flatten().fieldErrors,
  });
}

function parsePagination(query: any) {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  return {
    page: Math.max(1, page),
    limit: Math.max(1, Math.min(100, limit)), // límite máximo 100
  };
}

// ─── Controlador ─────────────────────────────────────
export const estudianteXUnidadCurricularController = {

  // GET /estudiantes-x-unidad-curricular?page=1&limit=10
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await estudianteXUnidadCurricularService.getAll(page, limit);
      res.status(200).json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  },

  // GET /estudiantes-x-unidad-curricular/:id
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseId(req.params.id as string);
      if (id === null) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const record = await estudianteXUnidadCurricularService.getById(id);
      if (!record) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ningún registro con id ${id}.`,
        });
      }
      res.status(200).json({ status: 'success', data: record });
    } catch (err) {
      next(err);
    }
  },

  // POST /estudiantes-x-unidad-curricular
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateEstudianteXUnidadCurricularDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const nuevo = await estudianteXUnidadCurricularService.create(parsed.data);
      res
        .status(201)
        .location(`/api/v1/estudiantes-x-unidad-curricular/${nuevo.id}`)
        .json({ status: 'success', data: nuevo });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /estudiantes-x-unidad-curricular/:id
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseId(req.params.id as string);
      if (id === null) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const parsed = UpdateEstudianteXUnidadCurricularDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const actualizado = await estudianteXUnidadCurricularService.update(id, parsed.data);
      if (!actualizado) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ningún registro con id ${id}.`,
        });
      }
      res.status(200).json({ status: 'success', data: actualizado });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /estudiantes-x-unidad-curricular/:id
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseId(req.params.id as string);
      if (id === null) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const eliminado = await estudianteXUnidadCurricularService.delete(id);
      if (!eliminado) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ningún registro con id ${id}.`,
        });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
