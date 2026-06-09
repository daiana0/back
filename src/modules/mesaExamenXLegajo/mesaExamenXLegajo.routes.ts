import { Router } from 'express';
import { mesaExamenXLegajoController } from './controller/mesaExamenXLegajo.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const mesaExamenXLegajoRouter = Router();

// Lectura: cualquier autenticado
mesaExamenXLegajoRouter.get('/', validateJwt, mesaExamenXLegajoController.getAll);
mesaExamenXLegajoRouter.get('/:id', validateJwt, mesaExamenXLegajoController.getById);

// Escritura: solo ADMIN
mesaExamenXLegajoRouter.post('/', validateJwt, validateRole(Role.ADMIN), mesaExamenXLegajoController.create);
mesaExamenXLegajoRouter.patch('/:id', validateJwt, validateRole(Role.ADMIN), mesaExamenXLegajoController.update);
mesaExamenXLegajoRouter.delete('/:id', validateJwt, validateRole(Role.ADMIN), mesaExamenXLegajoController.delete);
