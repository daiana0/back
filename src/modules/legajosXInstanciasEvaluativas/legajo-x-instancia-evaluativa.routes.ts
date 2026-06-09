import { Router } from 'express';
import { legajoXInstanciaEvaluativaController } from './controller/legajo-x-instancia-evaluativa.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const legajoXInstanciaEvaluativaRouter = Router();

// Rutas de lectura (cualquier autenticado)
legajoXInstanciaEvaluativaRouter.get(
  '/',
  validateJwt,
  legajoXInstanciaEvaluativaController.getAll,
);

legajoXInstanciaEvaluativaRouter.get(
  '/legajo/:idLegajo',
  validateJwt,
  legajoXInstanciaEvaluativaController.getByLegajo,
);

legajoXInstanciaEvaluativaRouter.get(
  '/instancia/:idInstanciaEvaluativa',
  validateJwt,
  legajoXInstanciaEvaluativaController.getByInstanciaEvaluativa,
);

legajoXInstanciaEvaluativaRouter.get(
  '/:id',
  validateJwt,
  legajoXInstanciaEvaluativaController.getById,
);

// Rutas de escritura (solo ADMIN)
legajoXInstanciaEvaluativaRouter.post(
  '/',
  validateJwt,
  validateRole(Role.ADMIN),
  legajoXInstanciaEvaluativaController.create,
);

legajoXInstanciaEvaluativaRouter.patch(
  '/:id',
  validateJwt,
  validateRole(Role.ADMIN),
  legajoXInstanciaEvaluativaController.update,
);

legajoXInstanciaEvaluativaRouter.delete(
  '/:id',
  validateJwt,
  validateRole(Role.ADMIN),
  legajoXInstanciaEvaluativaController.delete,
);
