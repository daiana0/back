import { Request, Response, NextFunction } from 'express';
import { administrativoService } from '../service/administrativo.service.js';
import { CreateAdministrativoDto } from '../dto/create-administrativo.dto.js';
import { UpdateAdministrativoDto } from '../dto/update-administrativo.dto.js';
import { parsePagination } from '../../../helpers/parsePagination.js';
import { respondZodError } from '../../../helpers/respondZodError.js';


// ─── Controlador ─────────────────────────────────────
export const administrativoController = {

  // GET /administrativos?page=1&limit=10
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await administrativoService.getAll(page, limit);
      res.status(200).json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  },

  // GET /administrativos/:id
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const admin = await administrativoService.getById(id);
      if (!admin) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ningún administrativo con id ${id}.`
        });
      }
      res.status(200).json({ status: 'success', data: admin });
    } catch (err) {
      next(err);
    }
  },

  // POST /administrativos
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateAdministrativoDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const nuevo = await administrativoService.create(parsed.data);
      const respuesta = { id: nuevo.id, nombre: nuevo.nombre, apellido: nuevo.apellido, email: nuevo.email, dni: nuevo.dni, idRol: nuevo.idRol, telefono: nuevo.telefono, domicilio: nuevo.domicilio, activo: nuevo.activo }
      res
        .status(201)
        .location(`/api/v1/administrativos/${respuesta.id}`)
        .json({ status: 'success', data: respuesta });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /administrativos/:id
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const parsed = UpdateAdministrativoDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const actualizado = await administrativoService.update(id, parsed.data);
      if (!actualizado) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ningún administrativo con id ${id}.`,
        });
      }
      res.status(200).json({ status: 'success', data: actualizado });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /administrativos/:id
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const eliminado = await administrativoService.delete(id);
      if (!eliminado) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ningún administrativo con id ${id}.`,
        });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};