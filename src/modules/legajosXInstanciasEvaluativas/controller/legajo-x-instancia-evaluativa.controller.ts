import { Request, Response, NextFunction } from 'express';
import { legajoXInstanciaEvaluativaService } from '../service/legajo-x-instancia-evaluativa.service.js';
import { CreateLegajoXInstanciaEvaluativaDto } from '../dto/create-legajo-x-instancia-evaluativa.dto.js';
import { UpdateLegajoXInstanciaEvaluativaDto } from '../dto/update-legajo-x-instancia-evaluativa.dto.js';
import { parsePagination } from '../../../helpers/parsePagination.js';
import { respondZodError } from '../../../helpers/respondZodError.js';


export const legajoXInstanciaEvaluativaController = {

  // GET /legajos-x-instancias-evaluativas?page=1&limit=10
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await legajoXInstanciaEvaluativaService.getAll(page, limit);
      res.status(200).json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  },

  // GET /legajos-x-instancias-evaluativas/:id
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const registro = await legajoXInstanciaEvaluativaService.getById(id);
      if (!registro) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ningún registro con id ${id}.`,
        });
      }
      res.status(200).json({ status: 'success', data: registro });
    } catch (err) {
      next(err);
    }
  },

  // GET /legajos-x-instancias-evaluativas/legajo/:idLegajo
  getByLegajo: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idLegajo = parseInt(req.params.idLegajo as string);
      if (isNaN(idLegajo) || idLegajo <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "idLegajo" debe ser un entero positivo.',
        });
      }
      const registros = await legajoXInstanciaEvaluativaService.getByLegajo(idLegajo);
      res.status(200).json({ status: 'success', data: registros });
    } catch (err) {
      next(err);
    }
  },

  // GET /legajos-x-instancias-evaluativas/instancia/:idInstanciaEvaluativa
  getByInstanciaEvaluativa: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idInstancia = parseInt(req.params.idInstanciaEvaluativa as string);
      if (isNaN(idInstancia) || idInstancia <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "idInstanciaEvaluativa" debe ser un entero positivo.',
        });
      }
      const registros = await legajoXInstanciaEvaluativaService.getByInstanciaEvaluativa(idInstancia);
      res.status(200).json({ status: 'success', data: registros });
    } catch (err) {
      next(err);
    }
  },

  // POST /legajos-x-instancias-evaluativas
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateLegajoXInstanciaEvaluativaDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const nuevo = await legajoXInstanciaEvaluativaService.create(parsed.data);
      res
        .status(201)
        .location(`/api/v1/legajos-x-instancias-evaluativas/${nuevo.id}`)
        .json({ status: 'success', data: nuevo });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /legajos-x-instancias-evaluativas/:id
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const parsed = UpdateLegajoXInstanciaEvaluativaDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const actualizado = await legajoXInstanciaEvaluativaService.update(id, parsed.data);
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

  // DELETE /legajos-x-instancias-evaluativas/:id
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const eliminado = await legajoXInstanciaEvaluativaService.delete(id);
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
