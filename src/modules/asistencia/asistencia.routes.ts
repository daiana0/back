import { Router } from 'express';
import { asistenciaController } from './controller/asistencia.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const asistenciaRouter: Router = Router();

asistenciaRouter.get(
  '/estudiante/:id',
  validateJwt,
  asistenciaController.getByEstudianteId,
);

asistenciaRouter.get(
  '/asignacion/:idDivisionXUnidadCurricular/fecha/:fecha',
  validateJwt,
  validateRole(Role.ADMIN, Role.DOCENTE),
  asistenciaController.getByAsignacionAndFecha,
);

asistenciaRouter.get(
  '/resumen/:idDivisionXUnidadCurricular',
  validateJwt,
  validateRole(Role.ADMIN, Role.DOCENTE),
  asistenciaController.getResumen,
);

// Obtener todas las asistencias (con paginación)
asistenciaRouter.get(
  '/',
  validateJwt,
  asistenciaController.getAll,
);

// Obtener asistencia por ID (CRUD básico)
asistenciaRouter.get(
  '/:id',
  validateJwt,
  asistenciaController.getById,
);

// Rutas de escritura (requieren ADMIN o algún rol con permisos, ej: DOCENTE/ADMIN)
asistenciaRouter.post(
  '/registrar',
  validateJwt,
  validateRole(Role.ADMIN, Role.DOCENTE),
  asistenciaController.registrarMasivo,
);

asistenciaRouter.post(
  '/',
  validateJwt,
  validateRole(Role.ADMIN),
  asistenciaController.create,
);

// Modificar asistencia individual (CRUD básico - Admin)
asistenciaRouter.patch(
  '/:id',
  validateJwt,
  validateRole(Role.ADMIN),
  asistenciaController.update,
);

// Eliminar asistencia individual (CRUD básico - Admin)
asistenciaRouter.delete(
  '/:id',
  validateJwt,
  validateRole(Role.ADMIN),
  asistenciaController.delete,
);