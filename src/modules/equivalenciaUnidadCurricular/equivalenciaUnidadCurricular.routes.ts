import { Router } from 'express';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';
import { equivalenciaController } from './controller/equivalencia-unidad-curricular.controller.js';

export const equivalenciaRouter = Router();

// Lectura: cualquier usuario autenticado
equivalenciaRouter.get('/', validateJwt, equivalenciaController.getAll);
equivalenciaRouter.get('/:id', validateJwt, equivalenciaController.getById);

// Escritura: solo ADMIN
equivalenciaRouter.post(
    '/',
    validateJwt,
    validateRole(Role.ADMIN),
    equivalenciaController.create
);
equivalenciaRouter.patch(
    '/:id',
    validateJwt,
    validateRole(Role.ADMIN),
    equivalenciaController.update
);
equivalenciaRouter.delete(
    '/:id',
    validateJwt,
    validateRole(Role.ADMIN),
    equivalenciaController.delete
);