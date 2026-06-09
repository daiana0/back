import { Request, Response, NextFunction } from 'express';
import { docenteService } from '../service/docente.service.js';
import { CreateDocenteDto } from '../dto/create-docente.dto.js';
import { UpdateDocenteDto } from '../dto/update-docente.dto.js';
import { parsePagination } from '../../../helpers/parsePagination.js';
import { respondZodError } from '../../../helpers/respondZodError.js';

// ─── Controlador Docente ─────────────────────────────
export const docenteController = {

  // GET /docentes?page=1&limit=10
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await docenteService.getAll(page, limit);
      res.status(200).json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  },

  // GET /docentes/me/asignaciones
  getMeAsignaciones: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const docenteId = req.user?.id;
      if (!docenteId) {
        return res.status(401).json({
          status: 'error',
          message: 'Usuario no autenticado o token inválido',
        });
      }
      const asignaciones = await docenteService.getMeAsignaciones(docenteId);
      res.status(200).json({ status: 'success', data: asignaciones });
    } catch (err) {
      next(err);
    }
  },

  // GET /docentes/asignaciones/:idDivisionXUnidadCurricular/alumnos
  getAsignacionAlumnos: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idDivisionXUnidadCurricular = parseInt(req.params.idDivisionXUnidadCurricular as string);
      if (isNaN(idDivisionXUnidadCurricular) || idDivisionXUnidadCurricular <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "idDivisionXUnidadCurricular" debe ser un entero positivo.',
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
          (a) => a.idDivisionXUnidadCurricular === idDivisionXUnidadCurricular
        );
        if (!tieneAsignacion) {
          return res.status(403).json({
            status: 'error',
            message: 'Acceso denegado: esta comisión no está asignada a usted.',
          });
        }
      }

      const alumnos = await docenteService.getAsignacionAlumnos(idDivisionXUnidadCurricular);
      res.status(200).json({ status: 'success', data: alumnos });
    } catch (err) {
      next(err);
    }
  },

  // GET /docentes/asignaciones/:idDivisionXUnidadCurricular/panel-academico
  getPanelAcademico: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idDivisionXUnidadCurricular = parseInt(req.params.idDivisionXUnidadCurricular as string);
      if (isNaN(idDivisionXUnidadCurricular) || idDivisionXUnidadCurricular <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "idDivisionXUnidadCurricular" debe ser un entero positivo.',
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

      const result = await docenteService.getPanelAcademico(idDivisionXUnidadCurricular);
      if (!result) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró la división con id ${idDivisionXUnidadCurricular}.`,
        });
      }

      if (userRole === 'DOCENTE') {
        const tieneAsignacion = await docenteService.validarPertenenciaDocente(userId, idDivisionXUnidadCurricular);
        if (!tieneAsignacion) {
          return res.status(403).json({
            status: 'error',
            message: 'Acceso denegado: esta comisión no está asignada a usted.',
          });
        }
      }

      res.status(200).json({ status: 'success', data: result });
    } catch (err) {
      next(err);
    }
  },

  // GET /docentes/:id
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const docente = await docenteService.getById(id);
      if (!docente) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ningún docente con id ${id}.`,
        });
      }
      res.status(200).json({ status: 'success', data: docente });
    } catch (err) {
      next(err);
    }
  },

  // POST /docentes
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CreateDocenteDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const nuevo = await docenteService.create(parsed.data);
      const respuesta = {
        id: nuevo.id, nombre: nuevo.nombre,
        apellido: nuevo.apellido,
        email: nuevo.email,
        dni: nuevo.dni,
        titulo: nuevo.titulo,
        domicilio: nuevo.domicilio,
        telefono: nuevo.telefono,
        idAdministrativo: nuevo.idAdministrativo
      };
      res
        .status(201)
        .location(`/api/v1/docentes/${respuesta.id}`)
        .json({ status: 'success', data: respuesta });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /docentes/:id
  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const parsed = UpdateDocenteDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const actualizado = await docenteService.update(id, parsed.data);
      if (!actualizado) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ningún docente con id ${id}.`,
        });
      }
      res.status(200).json({ status: 'success', data: actualizado });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /docentes/:id
  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const eliminado = await docenteService.delete(id);
      if (!eliminado) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ningún docente con id ${id}.`,
        });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};