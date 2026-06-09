import { Router } from 'express';
import { dossierInstitucionalController } from './controller/dossier-institucional.controller.js';
import { validateJwt } from '../../core/middlewares/validate-jwt.middleware.js';
import { validateRole } from '../../core/middlewares/validate-role.middleware.js';
import { Role } from '../../core/enums/role.enum.js';

export const dossierInstitucionalRouter = Router();

// Lectura: cualquier autenticado puede ver los dossiers
dossierInstitucionalRouter.get('/', validateJwt, dossierInstitucionalController.getAll);
dossierInstitucionalRouter.get('/:id', validateJwt, dossierInstitucionalController.getById);

// Escritura: solo ADMIN puede crear, modificar o eliminar
dossierInstitucionalRouter.post('/', validateJwt, validateRole(Role.ADMIN), dossierInstitucionalController.create);
dossierInstitucionalRouter.patch('/:id', validateJwt, validateRole(Role.ADMIN), dossierInstitucionalController.update);
dossierInstitucionalRouter.delete('/:id', validateJwt, validateRole(Role.ADMIN), dossierInstitucionalController.delete);