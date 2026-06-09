import { Router } from 'express';
import { instanciaEvaluativaController } from './controller/instancia-evaluativa.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const instanciaEvaluativaRouter = Router();

// Rutas de lectura (cualquier autenticado)
instanciaEvaluativaRouter.get(
  '/',
  validateJwt,
  instanciaEvaluativaController.getAll,
);

instanciaEvaluativaRouter.get(
  '/:id',
  validateJwt,
  instanciaEvaluativaController.getById,
);

instanciaEvaluativaRouter.get(
  '/division-x-unidad-curricular/:idDivisionXUnidadCurricular',
  validateJwt,
  instanciaEvaluativaController.getByDivisionXUnidadCurricular,
);

instanciaEvaluativaRouter.get(
  '/:idInstanciaEvaluativa/calificaciones',
  validateJwt,
  validateRole(Role.ADMIN, Role.DOCENTE),
  instanciaEvaluativaController.getCalificaciones,
);

instanciaEvaluativaRouter.post(
  '/:idInstanciaEvaluativa/calificaciones',
  validateJwt,
  validateRole(Role.ADMIN, Role.DOCENTE),
  instanciaEvaluativaController.guardarCalificaciones,
);

// Rutas de escritura para docentes
instanciaEvaluativaRouter.post(
  '/docente',
  validateJwt,
  validateRole(Role.ADMIN, Role.DOCENTE),
  instanciaEvaluativaController.createDocente,
);

// Rutas de escritura (solo ADMIN)
instanciaEvaluativaRouter.post(
  '/',
  validateJwt,
  validateRole(Role.ADMIN),
  instanciaEvaluativaController.create,
);

instanciaEvaluativaRouter.patch(
  '/:id',
  validateJwt,
  validateRole(Role.ADMIN),
  instanciaEvaluativaController.update,
);

instanciaEvaluativaRouter.delete(
  '/:id',
  validateJwt,
  validateRole(Role.ADMIN),
  instanciaEvaluativaController.delete,
);
