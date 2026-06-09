import { Request, Response, NextFunction } from 'express';
import { instanciaEvaluativaService } from '../service/instancia-evaluativa.service.js';
import { CreateInstanciaEvaluativaDto } from '../dto/create-instancia-evaluativa.dto.js';
import { CreateInstanciaEvaluativaDocenteDto } from '../dto/create-instancia-evaluativa-docente.dto.js';
import { UpdateInstanciaEvaluativaDto } from '../dto/update-instancia-evaluativa.dto.js';
import { GuardarCalificacionesDto } from '../dto/guardar-calificaciones.dto.js';
import { docenteService } from '../../docentes/service/docente.service.js';
import { parsePagination } from '../../../helpers/parsePagination.js';
import { respondZodError } from '../../../helpers/respondZodError.js';
import { Role } from '../../../core/enums/role.enum.js';


export const instanciaEvaluativaController = {

  // GET /instancias-evaluativas?page=1&limit=10
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await instanciaEvaluativaService.getAll(page, limit);
      res.status(200).json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  },

  // GET /instancias-evaluativas/:id
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const instancia = await instanciaEvaluativaService.getById(id);
      if (!instancia) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna instancia evaluativa con id ${id}.`,
        });
      }
      res.status(200).json({ status: 'success', data: instancia });
    } catch (err) {
      next(err);
    }
  },

  // GET /instancias-evaluativas/division-x-unidad-curricular/:idDivisionXUnidadCurricular
  getByDivisionXUnidadCurricular: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.idDivisionXUnidadCurricular as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "idDivisionXUnidadCurricular" debe ser un entero positivo.',
        });
      }
      const instancias = await instanciaEvaluativaService.getByDivisionXUnidadCurricular(id);
      res.status(200).json({ status: 'success', data: instancias });
    } catch (err) {
      next(err);
    }
  },

  // POST /instancias-evaluativas/docente
  createDocente: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateInstanciaEvaluativaDocenteDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }

      const { idDivisionXUnidadCurricular, descripcion, fecha, tipo } = parsed.data;
      const userId = req.user?.id;
      const userRole = req.user?.rol;

      if (!userId || !userRole) {
        return res.status(401).json({
          status: 'error',
          message: 'Usuario no autenticado o token inválido',
        });
      }

      // 1. Autorización: CA-02 / Validación de asignación activa
      if (userRole === Role.DOCENTE) {
        const tieneAsignacionActiva = await docenteService.validarPertenenciaDocente(userId, idDivisionXUnidadCurricular);
        if (!tieneAsignacionActiva) {
          return res.status(403).json({
            status: 'error',
            message: 'No posee permisos para crear instancias evaluativas en esta asignación.',
          });
        }
      }

      // 2. Validación de Nombre Duplicado: CA-03
      const existentes = await instanciaEvaluativaService.getByDivisionXUnidadCurricular(idDivisionXUnidadCurricular);
      const normalizar = (str: string) => str.trim().toLowerCase().replace(/\s+/g, ' ');
      const duplicado = existentes.some(
        (inst) => normalizar(inst.descripcion) === normalizar(descripcion)
      );
      if (duplicado) {
        return res.status(409).json({
          status: 'error',
          code: 'DUPLICATE_NAME',
          message: 'Ya existe una instancia evaluativa con ese nombre para la comisión seleccionada.',
        });
      }

      // 3. Resolución automática de idAdministrativo
      let idAdministrativo = userId;
      if (userRole === Role.DOCENTE) {
        const docente = await docenteService.getById(userId);
        if (!docente) {
          return res.status(404).json({
            status: 'error',
            message: 'No se encontró el docente correspondiente.',
          });
        }
        idAdministrativo = docente.idAdministrativo;
      }

      // 4. Guardar
      const nueva = await instanciaEvaluativaService.create({
        idDivisionXUnidadCurricular,
        descripcion,
        fecha,
        tipo,
        idAdministrativo,
      });

      res
        .status(201)
        .location(`/api/v1/instancias-evaluativas/${nueva.id}`)
        .json({ status: 'success', data: nueva });
    } catch (err) {
      next(err);
    }
  },

  // POST /instancias-evaluativas
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateInstanciaEvaluativaDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const nueva = await instanciaEvaluativaService.create(parsed.data);
      res
        .status(201)
        .location(`/api/v1/instancias-evaluativas/${nueva.id}`)
        .json({ status: 'success', data: nueva });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /instancias-evaluativas/:id
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const parsed = UpdateInstanciaEvaluativaDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const actualizada = await instanciaEvaluativaService.update(id, parsed.data);
      if (!actualizada) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna instancia evaluativa con id ${id}.`,
        });
      }
      res.status(200).json({ status: 'success', data: actualizada });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /instancias-evaluativas/:id
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const eliminada = await instanciaEvaluativaService.delete(id);
      if (!eliminada) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna instancia evaluativa con id ${id}.`,
        });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  // GET /instancias-evaluativas/:idInstanciaEvaluativa/calificaciones
  getCalificaciones: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idInstanciaEvaluativa = parseInt(req.params.idInstanciaEvaluativa as string);
      if (isNaN(idInstanciaEvaluativa) || idInstanciaEvaluativa <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "idInstanciaEvaluativa" debe ser un entero positivo.',
        });
      }

      const instancia = await instanciaEvaluativaService.getById(idInstanciaEvaluativa);
      if (!instancia) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna instancia evaluativa con id ${idInstanciaEvaluativa}.`,
        });
      }

      const userId = req.user?.id;
      const userRole = req.user?.rol;
      if (!userId || !userRole) {
        return res.status(401).json({
          status: 'error',
          message: 'Usuario no autenticado o token inválido',
        });
      }

      if (userRole === 'DOCENTE') {
        const asignaciones = await docenteService.getMeAsignaciones(userId);
        const tieneAsignacion = asignaciones.some(
          (a) => a.idDivisionXUnidadCurricular === instancia.idDivisionXUnidadCurricular
        );
        if (!tieneAsignacion) {
          return res.status(403).json({
            status: 'error',
            message: 'Acceso denegado: esta instancia evaluativa no pertenece a ninguna de sus asignaciones.',
          });
        }
      }

      const calificaciones = await instanciaEvaluativaService.getCalificaciones(idInstanciaEvaluativa);
      res.status(200).json({ status: 'success', data: calificaciones });
    } catch (err) {
      next(err);
    }
  },

  // POST /instancias-evaluativas/:idInstanciaEvaluativa/calificaciones
  guardarCalificaciones: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idInstanciaEvaluativa = parseInt(req.params.idInstanciaEvaluativa as string);
      if (isNaN(idInstanciaEvaluativa) || idInstanciaEvaluativa <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "idInstanciaEvaluativa" debe ser un entero positivo.',
        });
      }

      const instancia = await instanciaEvaluativaService.getById(idInstanciaEvaluativa);
      if (!instancia) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ninguna instancia evaluativa con id ${idInstanciaEvaluativa}.`,
        });
      }

      const userId = req.user?.id;
      const userRole = req.user?.rol;
      if (!userId || !userRole) {
        return res.status(401).json({
          status: 'error',
          message: 'Usuario no autenticado o token inválido',
        });
      }

      if (userRole === 'DOCENTE') {
        const asignaciones = await docenteService.getMeAsignaciones(userId);
        const tieneAsignacion = asignaciones.some(
          (a) => a.idDivisionXUnidadCurricular === instancia.idDivisionXUnidadCurricular
        );
        if (!tieneAsignacion) {
          return res.status(403).json({
            status: 'error',
            message: 'Acceso denegado: esta instancia evaluativa no pertenece a ninguna de sus asignaciones.',
          });
        }
      }

      const parsed = GuardarCalificacionesDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }

      await instanciaEvaluativaService.guardarCalificaciones(
        idInstanciaEvaluativa,
        parsed.data,
        userId,
        userRole
      );

      res.status(200).json({
        status: 'success',
        message: 'Calificaciones registradas correctamente.',
      });
    } catch (err) {
      next(err);
    }
  },
};
