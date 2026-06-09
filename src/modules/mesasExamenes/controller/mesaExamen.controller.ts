import { Request, Response, NextFunction } from 'express';
import { mesaExamenService } from '../service/mesa-examen.service.js';
import { CreateMesaExamenDto } from '../dto/create-mesa-examen.dto.js';
import { UpdateMesaExamenDto } from '../dto/update-mesa-examen.dto.js';
import { parsePagination } from '../../../helpers/parsePagination.js';
import { respondZodError } from '../../../helpers/respondZodError.js';

// ─── Controlador ─────────────────────────────────────
export const mesaExamenController = {

  // GET /mesas-examenes?page=1&limit=10
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await mesaExamenService.getAll(page, limit);
      res.status(200).json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  },

  // GET /mesas-examenes/:id
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const mesa = await mesaExamenService.getById(id);
      if (!mesa) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna Mesa de Examen con id ${id}.`,
        });
      }
      res.status(200).json({ status: 'success', data: mesa });
    } catch (err) {
      next(err);
    }
  },

  // POST /mesas-examenes
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateMesaExamenDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const nuevo = await mesaExamenService.create(parsed.data);
      res
        .status(201)
        .location(`/api/v1/mesas-examenes/${nuevo.id}`)
        .json({ status: 'success', data: nuevo });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /mesas-examenes/:id
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const parsed = UpdateMesaExamenDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const actualizado = await mesaExamenService.update(id, parsed.data);
      if (!actualizado) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna Mesa de Examen con id ${id}.`,
        });
      }
      res.status(200).json({ status: 'success', data: actualizado });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /mesas-examenes/:id
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const eliminado = await mesaExamenService.delete(id);
      if (!eliminado) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna Mesa de Examen con id ${id}.`,
        });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
