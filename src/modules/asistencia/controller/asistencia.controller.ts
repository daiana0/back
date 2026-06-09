import { Request, Response, NextFunction } from 'express';
import { asistenciaService } from '../service/asistencia.service.js';
import { CreateAsistenciaDto } from '../dto/create-asistencia.dto.js';
import { UpdateAsistenciaDto } from '../dto/update-asistencia.dto.js';
import { parsePagination } from '../../../helpers/parsePagination.js';
import { respondZodError } from '../../../helpers/respondZodError.js';
import { assertEstudianteOwnership } from '../../../helpers/estudiante-ownership.helper.js';
import { docenteService } from '../../docentes/service/docente.service.js';
import { Role } from '../../../core/enums/role.enum.js';

export const asistenciaController = {

  // GET /asistencias?page=1&limit=10
  getAll: async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const { page, limit } = parsePagination(req.query);
      const result = await asistenciaService.getAll(page, limit);
      return res.status(200).json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  },

  // GET /asistencias/:id
  getById: async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const record = await asistenciaService.getById(id);
      if (!record) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ningún registro con id ${id}.`,
        });
      }
      return res.status(200).json({ status: 'success', data: record });
    } catch (err) {
      next(err);
    }
  },

  // GET /asistencias/estudiante/:id
  getByEstudianteId: async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const estudianteId = parseInt(req.params.id as string);
      if (isNaN(estudianteId) || estudianteId <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" del estudiante debe ser un entero positivo.',
        });
      }
      
      await assertEstudianteOwnership(req, estudianteId);

      const records = await asistenciaService.getByEstudianteId(estudianteId);
      if (!records) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontraron asistencias para el estudiante con id ${estudianteId}.`,
        });
      }
      return res.status(200).json({ status: 'success', data: records });
    } catch (err) {
      next(err);
    }
  },

  // POST /asistencias
  create: async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const parsed = CreateAsistenciaDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const nuevo = await asistenciaService.create(parsed.data);
      return res
        .status(201)
        .location(`/api/v1/asistencias/${nuevo.id}`)
        .json({ status: 'success', data: nuevo });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /asistencias/:id
  update: async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const parsed = UpdateAsistenciaDto.safeParse(req.body);
      if (!parsed.success) {
        return respondZodError(res, parsed.error);
      }
      const actualizado = await asistenciaService.update(id, parsed.data);
      if (!actualizado) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ningún registro con id ${id}.`,
        });
      }
      return res.status(200).json({ status: 'success', data: actualizado });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /asistencias/:id
  delete: async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El parámetro "id" debe ser un entero positivo.',
        });
      }
      const eliminado = await asistenciaService.delete(id);
      if (!eliminado) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró ningún registro con id ${id}.`,
        });
      }
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  getByAsignacionAndFecha: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idDivisionXUnidadCurricular = parseInt(req.params.idDivisionXUnidadCurricular as string);
      const fecha = req.params.fecha as string;

      if (isNaN(idDivisionXUnidadCurricular) || idDivisionXUnidadCurricular <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El idDivisionXUnidadCurricular debe ser un entero positivo.',
        });
      }

      // Validar fecha futura
      const todayStr = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD local
      if (fecha > todayStr) {
        return res.status(400).json({
          status: 'error',
          message: 'No se puede registrar asistencia para una fecha futura.',
        });
      }

      const result = await asistenciaService.getAsistenciaPorAsignacionYFecha(idDivisionXUnidadCurricular, fecha);
      res.status(200).json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  },

  registrarMasivo: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idDivisionXUnidadCurricular, fecha, asistencias } = req.body;

      if (!idDivisionXUnidadCurricular || isNaN(idDivisionXUnidadCurricular) || idDivisionXUnidadCurricular <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El idDivisionXUnidadCurricular es obligatorio.',
        });
      }

      if (!fecha) {
        return res.status(400).json({
          status: 'error',
          message: 'La fecha es obligatoria.',
        });
      }

      const userId = req.user!.id;
      const userRole = req.user!.rol;

      // Validar fecha futura
      const todayStr = new Date().toLocaleDateString('sv-SE');
      if (fecha > todayStr) {
        return res.status(400).json({
          status: 'error',
          message: 'No se puede registrar asistencia para una fecha futura.',
        });
      }

      // Validar límite de 48 horas hacia atrás solo para docentes
      if (userRole === Role.DOCENTE) {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const limitStr = twoDaysAgo.toLocaleDateString('sv-SE');
        if (fecha < limitStr) {
          return res.status(400).json({
            status: 'error',
            message: 'El plazo de 48 horas para registrar o editar la asistencia ha expirado.',
          });
        }
      }

      if (!asistencias || !Array.isArray(asistencias)) {
        return res.status(400).json({
          status: 'error',
          message: 'El listado de asistencias debe ser un array.',
        });
      }

      // Validar que no haya presentes null o undefined
      for (const a of asistencias) {
        if (a.presente === null || a.presente === undefined) {
          return res.status(400).json({
            status: 'error',
            message: 'Debe registrar la asistencia de todos los alumnos antes de guardar.',
          });
        }
      }

      await asistenciaService.registrarAsistenciaMasiva(
        { idDivisionXUnidadCurricular, fecha, asistencias },
        userId,
        userRole
      );

      res.status(200).json({
        status: 'success',
        message: 'Asistencia registrada correctamente.',
      });
    } catch (err) {
      next(err);
    }
  },

  getResumen: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idDivisionXUnidadCurricular = parseInt(req.params.idDivisionXUnidadCurricular as string);
      if (isNaN(idDivisionXUnidadCurricular) || idDivisionXUnidadCurricular <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'El idDivisionXUnidadCurricular debe ser un entero positivo.',
        });
      }

      const userId = req.user?.id;
      const userRole = req.user?.rol;

      if (userRole === Role.DOCENTE && userId) {
        const tieneAsignacion = await docenteService.validarPertenenciaDocente(userId, idDivisionXUnidadCurricular);
        if (!tieneAsignacion) {
          return res.status(403).json({
            status: 'error',
            message: 'Acceso denegado: esta comisión no está asignada a usted.',
          });
        }
      }

      const mes = req.query.mes as string | undefined;

      const data = await asistenciaService.getResumenAsistencia(idDivisionXUnidadCurricular, mes);
      res.status(200).json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  },
};