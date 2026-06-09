import { Router } from 'express';
import { estudianteController } from './controller/estudiante.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const estudianteRouter = Router();

// Lectura: cualquier autenticado puede ver estudiantes
estudianteRouter.get('/', validateJwt, estudianteController.getAll);
estudianteRouter.get('/:id/dashboard', validateJwt, estudianteController.getDashboard);
estudianteRouter.get('/:id', validateJwt, estudianteController.getById);

// estudiante puede actualizar usando PUT
estudianteRouter.put('/:id', validateJwt, estudianteController.update);

//ADMIN puede crear o eliminar estudiantes
estudianteRouter.post('/', validateJwt, validateRole(Role.ADMIN), estudianteController.create);
estudianteRouter.delete('/:id', validateJwt, validateRole(Role.ADMIN), estudianteController.delete);
estudianteRouter.get('/by-usuario/:idUsuario', validateJwt, estudianteController.getByUsuarioId);
estudianteRouter.get('/:id/legajo',validateJwt, validateRole(Role.ESTUDIANTE,Role.ADMIN),estudianteController.getLegajo);
estudianteRouter.get('/:id/legajos',validateJwt, validateRole(Role.ESTUDIANTE,Role.ADMIN),estudianteController.getAllLegajos);