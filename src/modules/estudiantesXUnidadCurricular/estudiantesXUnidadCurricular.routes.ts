import { Router } from 'express';
import { estudianteXUnidadCurricularController } from './controller/estudianteXUnidadCurricular.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const estudianteXUnidadCurricularRouter = Router();

// Rutas de lectura (cualquier autenticado)
estudianteXUnidadCurricularRouter.get(
  '/',
  validateJwt,
  estudianteXUnidadCurricularController.getAll,
);

estudianteXUnidadCurricularRouter.get(
  '/:id',
  validateJwt,
  estudianteXUnidadCurricularController.getById,
);

estudianteXUnidadCurricularRouter.post(
  '/',
  validateJwt,
  validateRole(Role.ADMIN),
  estudianteXUnidadCurricularController.create,
);

estudianteXUnidadCurricularRouter.patch(
  '/:id',
  validateJwt,
  validateRole(Role.ADMIN),
  estudianteXUnidadCurricularController.update,
);

estudianteXUnidadCurricularRouter.delete(
  '/:id',
  validateJwt,
  validateRole(Role.ADMIN),
  estudianteXUnidadCurricularController.delete,
);
