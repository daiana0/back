import { Request, Response, NextFunction } from 'express';
import { estudianteService } from '../service/estudiante.service.js';
import { estudianteDashboardService } from '../service/estudiante-dashboard.service.js';
import { CreateEstudianteDto } from '../dto/create-estudiante.dto.js';
import { UpdateEstudianteDto } from '../dto/update-estudiante.dto.js';
import { respondZodError } from '../../../helpers/respondZodError.js';
import { parsePagination } from '../../../helpers/parsePagination.js';
import {AppError} from '../../../core/middlewares/error-handler.middleware.js';
import { Role } from '../../../core/enums/role.enum.js';
import Estudiante from '../model/Estudiante.js';
import Legajo from '../../legajos/model/Legajo.js';
import { assertEstudianteOwnership } from '../../../helpers/estudiante-ownership.helper.js';
import PlanEstudio from '../../planes_estudios/model/PlanEstudio.js';
import Carrera from '../../carreras/model/Carrera.js';

export const estudianteController = {
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit } = parsePagination(req.query);
            const result = await estudianteService.getAll(page, limit);
            res.status(200).json({ status: 'success', ...result });
        } catch (err) {
            next(err);
        }
    },

    getDashboard: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ status: 'error', message: 'ID inválido' });
            }

            const user = (req as any).user;
            if (user?.rol === Role.ESTUDIANTE) {
                const isOwner = await estudianteDashboardService.belongsToUsuario(id, user.id);
                if (!isOwner) {
                    return res.status(403).json({ status: 'error', message: 'No autorizado para ver este dashboard' });
                }
            }

            const dashboard = await estudianteDashboardService.getDashboard(id);
            if (!dashboard) {
                return res.status(404).json({ status: 'error', message: `No se encontró estudiante con id ${id}` });
            }

            res.status(200).json({ status: 'success', data: dashboard });
        } catch (err) {
            next(err);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ status: 'error', message: 'ID inválido' });
            }

            await assertEstudianteOwnership(req, id);

            const estudiante = await estudianteService.getById(id);
            if (!estudiante) {
                return res.status(404).json({ status: 'error', message: `No se encontró estudiante con id ${id}` });
            }
            res.status(200).json({ status: 'success', data: estudiante });
        } catch (err) {
            next(err);
        }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = CreateEstudianteDto.safeParse(req.body);
            if (!parsed.success) return respondZodError(res, parsed.error);
            const nuevo = await estudianteService.create(parsed.data);
            res.status(201).location(`/api/v1/estudiantes/${nuevo.id}`).json({ status: 'success', data: nuevo });
        } catch (err) {
            next(err);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ status: 'error', message: 'ID inválido' });
            }

            await assertEstudianteOwnership(req, id);

            const parsed = UpdateEstudianteDto.safeParse(req.body);
            if (!parsed.success) return respondZodError(res, parsed.error);
            const actualizado = await estudianteService.update(id, parsed.data);
            if (!actualizado) {
                return res.status(404).json({ status: 'error', message: `No se encontró estudiante con id ${id}` });
            }
            res.status(200).json({ status: 'success', data: actualizado });
        } catch (err) {
            next(err);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ status: 'error', message: 'ID inválido' });
            }
            const eliminado = await estudianteService.delete(id);
            if (!eliminado) {
                return res.status(404).json({ status: 'error', message: `No se encontró estudiante con id ${id}` });
            }
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },

    async getLegajo(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) throw new AppError('ID inválido', 400);

            await assertEstudianteOwnership(req, id);

            const estudiante = await Estudiante.findByPk(id, {
                include: [{
                    model: Legajo,
                    as: 'legajos',
                    where: { activo: true },
                    required: false,
                    limit: 1
                }]
            });

            if (!estudiante) throw new AppError('Estudiante no encontrado', 404);

            const legajoActivo = estudiante.legajos?.[0];
            if (!legajoActivo) throw new AppError('El estudiante no tiene un legajo activo', 404);

            res.status(200).json({
                status: 'success',
                data: {
                    id: legajoActivo.id,
                    numeroLegajo: legajoActivo.numeroLegajo,
                    idPlanEstudio: legajoActivo.idPlanEstudio
                }
            });
        } catch (err) {
            next(err);
        }
    },

    async getAllLegajos(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) throw new AppError('ID inválido', 400);

            const estudiante = await Estudiante.findByPk(id, {
                include: [{
                    model: Legajo,
                    as: 'legajos',
                    required: false,
                    include: [{
                        model: PlanEstudio,
                        as: 'planEstudio',
                        attributes: ['id', 'version', 'duracionEnAnios'],
                        include: [{
                            model: Carrera,
                            as: 'carrera',
                            attributes: ['id', 'nombre', 'tipo', 'codigo']
                        }]
                    }]
                }]
            });

            if (!estudiante) throw new AppError('Estudiante no encontrado', 404);

            res.status(200).json({
                status: 'success',
                data: estudiante.legajos || []
            });
        } catch (err) {
            next(err);
        }
    },

    async getByUsuarioId(req: Request, res: Response, next: NextFunction) {
        try {
            const idUsuario = parseInt(req.params.idUsuario as string);
            if (isNaN(idUsuario)) throw new AppError('ID de usuario inválido', 400);

            const estudiante = await Estudiante.findOne({
                where: { idUsuario }
            });

            if (!estudiante) throw new AppError('Estudiante no encontrado para el usuario', 404);

            res.status(200).json({
                status: 'success',
                data: estudiante
            });
        } catch (err) {
            next(err);
        }
    }
};