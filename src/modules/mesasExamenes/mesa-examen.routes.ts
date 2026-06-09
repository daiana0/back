import { Router } from 'express';
import { mesaExamenController } from './controller/mesaExamen.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const mesaExamenRouter = Router();

// Rutas de lectura (Cualquier usuario autenticado puede ver las mesas)
mesaExamenRouter.get(
    '/',
    validateJwt,
    mesaExamenController.getAll,
);

mesaExamenRouter.get(
    '/:id',
    validateJwt,
    mesaExamenController.getById,
);

// Rutas de escritura (Solo ADMIN o personal autorizado puede crear/modificar)
mesaExamenRouter.post(
    '/',
    validateJwt,
    validateRole(Role.ADMIN), // Aquí podrías agregar otros roles si fuera necesario
    mesaExamenController.create,
);

mesaExamenRouter.patch(
    '/:id',
    validateJwt,
    validateRole(Role.ADMIN),
    mesaExamenController.update,
);

mesaExamenRouter.delete(
    '/:id',
    validateJwt,
    validateRole(Role.ADMIN),
    mesaExamenController.delete,
);
