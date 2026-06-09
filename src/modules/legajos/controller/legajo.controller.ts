import { Request, Response, NextFunction } from 'express';
import { legajoService } from '../service/legajo.service.js';
import { CreateLegajoDto } from '../dto/create-legajo.dto.js';
import { UpdateLegajoDto } from '../dto/update-legajo.dto.js';
import { respondZodError } from '../../../helpers/respondZodError.js';
import { parsePagination } from '../../../helpers/parsePagination.js';
import { AppError } from '../../../core/middlewares/error-handler.middleware.js';
import { assertLegajoOwnership } from '../../../helpers/estudiante-ownership.helper.js';
import EstudianteXUnidadCurricular from '../../estudiantesXUnidadCurricular/model/EstudianteXUnidadCurricular.js';
import DivisionXUnidadCurricular from '../../divisionXUnidadCurricular/model/DivisionXUnidadCurricular.js';
import UnidadCurricular from '../../unidades_curriculares/model/UnidadCurricular.js';
import LegajoXInstanciaEvaluativa from '../../legajosXInstanciasEvaluativas/model/LegajoXInstanciaEvaluativa.js';
import InstanciaEvaluativa from '../../instanciasEvaluativas/model/InstanciaEvaluativa.js';
import Division from '../../division/model/Division.js';
import Curso from '../../cursos/model/Curso.js';

export const legajoController = {
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, limit } = parsePagination(req.query);
            const result = await legajoService.getAll(page, limit);
            res.status(200).json({ status: 'success', ...result });
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
            const legajo = await legajoService.getByIdWithDetails(id);
            if (!legajo) {
                return res.status(404).json({ status: 'error', message: `No se encontró legajo con id ${id}` });
            }
            res.status(200).json({ status: 'success', data: legajo });
        } catch (err) {
            next(err);
        }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = CreateLegajoDto.safeParse(req.body);
            if (!parsed.success) return respondZodError(res, parsed.error);
            const nuevo = await legajoService.create(parsed.data);
            res.status(201).location(`/api/v1/legajos/${nuevo.id}`).json({ status: 'success', data: nuevo });
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
            const parsed = UpdateLegajoDto.safeParse(req.body);
            if (!parsed.success) return respondZodError(res, parsed.error);
            const actualizado = await legajoService.update(id, parsed.data);
            if (!actualizado) {
                return res.status(404).json({ status: 'error', message: `No se encontró legajo con id ${id}` });
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
            const eliminado = await legajoService.delete(id);
            if (!eliminado) {
                return res.status(404).json({ status: 'error', message: `No se encontró legajo con id ${id}` });
            }
            res.status(204).send();
        } catch (err) {
            next(err);
        }
    },

    async getUnidadesCurriculares(req: Request, res: Response, next: NextFunction) {
        try {
            const legajoId = parseInt(req.params.idLegajo);
            if (isNaN(legajoId)) throw new AppError('ID de legajo inválido', 400);

            await assertLegajoOwnership(req, legajoId);

            const data = await legajoService.getUnidadesCurricularesData(legajoId);
            res.status(200).json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    },

    async getInstanciasEvaluativas(req: Request, res: Response, next: NextFunction) {
        try {
            const legajoId = parseInt(req.params.idLegajo);
            if (isNaN(legajoId)) throw new AppError('ID de legajo inválido', 400);

            await assertLegajoOwnership(req, legajoId);

            const inscripciones = await EstudianteXUnidadCurricular.findAll({
                where: { idLegajo: legajoId },
                attributes: ['idDivisionXUnidadCurricular'],
            });
            const dxucInscriptos = inscripciones.map((i) => i.idDivisionXUnidadCurricular);

            if (dxucInscriptos.length === 0) {
                return res.status(200).json({ status: 'success', data: [] });
            }

            const tipo = req.query.tipo as string | undefined;
            const whereInstancia: Record<string, unknown> = {
                idDivisionXUnidadCurricular: dxucInscriptos,
            };
            if (tipo && tipo !== 'todos') {
                const tipoMap: Record<string, string> = {
                    'parcial': 'parcial',
                    'final': 'examen final',
                    'trabajo_practico': 'trabajo practico',
                    'recuperatorio': 'recuperatorio',
                    'proyecto_integrador': 'proyecto integrador'
                };
                const backendTipo = tipoMap[tipo];
                if (backendTipo) whereInstancia.tipo = backendTipo;
            }

            const notas = await LegajoXInstanciaEvaluativa.findAll({
                where: { idLegajo: legajoId },
                include: [
                    {
                        model: InstanciaEvaluativa,
                        as: 'instanciaEvaluativa',
                        where: whereInstancia,
                        attributes: ['descripcion', 'tipo', 'fecha'],   // ← atributos de InstanciaEvaluativa
                        include: [                                      // ← include anidado
                            {
                                model: DivisionXUnidadCurricular,
                                as: 'divisionXUnidadCurricular',
                                include: [
                                    {
                                        model: UnidadCurricular,
                                        as: 'unidadCurricular',
                                        attributes: ['nombre']
                                    }
                                ]
                            }
                        ]
                    }
                ],
                attributes: ['id', 'nota', 'fechaRegistro'],       // ← atributos de LegajoXInstanciaEvaluativa
                order: [['fechaRegistro', 'DESC']]                 // ← order al nivel del findAll
            });

            const data = notas.map(nota => ({
                id: nota.id,
                nombreMateria: nota.instanciaEvaluativa?.divisionXUnidadCurricular?.unidadCurricular?.nombre || '',
                descripcion: nota.instanciaEvaluativa?.descripcion || '',
                tipo: nota.instanciaEvaluativa?.tipo || '',
                fecha: nota.instanciaEvaluativa?.fecha ? nota.instanciaEvaluativa.fecha.toISOString().split('T')[0] : '',
                nota: nota.nota
            }));

            res.status(200).json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    },

    async getHistorialAcademico(req: Request, res: Response, next: NextFunction) {
        try {
            const legajoId = parseInt(req.params.idLegajo);
            if (isNaN(legajoId)) throw new AppError('ID de legajo inválido', 400);

            await assertLegajoOwnership(req, legajoId);

            const asistenciasMap = await legajoService.getPorcentajesAsistenciaPorLegajo(legajoId);

            const inscripciones = await EstudianteXUnidadCurricular.findAll({
                where: { idLegajo: legajoId },
                include: [
                    {
                        model: DivisionXUnidadCurricular,
                        as: 'divisionXUnidadCurricular',
                        include: [
                            {
                                model: Division,
                                as: 'division',
                                include: [{ model: Curso, as: 'curso' }]
                            },
                            {
                                model: UnidadCurricular,
                                as: 'unidadCurricular',
                                attributes: ['id', 'nombre']
                            }
                        ]
                    }
                ]
            });
            const historial = await Promise.all(
                inscripciones.map(async (insc) => {
                    const dxuc = insc.divisionXUnidadCurricular;
                    const uc = dxuc?.unidadCurricular;
                    const division = dxuc?.division;
                    const curso = division?.curso;
                    const anio = curso?.anioAcademico || 1;

                    if (!uc) return null;

                    const promedioAsistencia = asistenciasMap.get(dxuc.id) || 0;

                    // Obtener instancias evaluativas (igual que antes)
                    const instanciasConNotas = await LegajoXInstanciaEvaluativa.findAll({
                        where: { idLegajo: legajoId },
                        include: [
                            {
                                model: InstanciaEvaluativa,
                                as: 'instanciaEvaluativa',
                                where: { idDivisionXUnidadCurricular: dxuc.id },
                                attributes: ['descripcion', 'tipo', 'fecha']
                            }
                        ],
                        attributes: ['id', 'nota']
                    });

                    const instancias = instanciasConNotas.map(inst => ({
                        id: inst.id,
                        descripcion: inst.instanciaEvaluativa?.descripcion || '',
                        tipo: inst.instanciaEvaluativa?.tipo || '',
                        fecha: inst.instanciaEvaluativa?.fecha?.toISOString().split('T')[0] || '',
                        nota: inst.nota
                    }));

                    return {
                        idUnidadCurricular: uc.id,
                        nombre: uc.nombre,
                        anio,
                        condicion: insc.condicion,
                        promedioAsistencia,
                        instancias
                    };
                })
            );

            const data = historial.filter(h => h !== null);
            res.status(200).json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    },

    async getResumenAcademico(req: Request, res: Response, next: NextFunction) {
        try {
            const legajoId = parseInt(req.params.idLegajo);
            if (isNaN(legajoId)) throw new AppError('ID de legajo inválido', 400);

            await assertLegajoOwnership(req, legajoId);

            // Obtener todas las UC con sus promedios y condiciones
            const legajo = await legajoService.getById(legajoId);
            if (!legajo) throw new AppError('Legajo no encontrado', 404);

            const unidades = await legajoService.getUnidadesCurricularesData(legajoId);

            let promocionadas = 0, regulares = 0, libres = 0;
            let sumaPromedios = 0;
            let materiasConNota = 0;

            for (const uc of unidades) {
                if (uc.condicion === 'promocionado') promocionadas++;
                else if (uc.condicion === 'regular') regulares++;
                else if (uc.condicion === 'libre') libres++;

                if (uc.promedio !== null) {
                    sumaPromedios += uc.promedio;
                    materiasConNota++;
                }
            }

            const promedioGeneral = materiasConNota > 0 ? parseFloat((sumaPromedios / materiasConNota).toFixed(1)) : 0;
            const totalMateriasInscriptas = unidades.length;
            const totalMateriasPlan = await legajoService.getTotalMateriasPlan(legajo.idPlanEstudio);

            res.status(200).json({
                status: 'success',
                data: {
                    promedioGeneral,
                    totalMateriasInscriptas,
                    totalMateriasPlan,
                    promocionadas,
                    regulares,
                    libres
                }
            });
        } catch (err) {
            next(err);
        }
    },

    async getMateriasPendientes(req: Request, res: Response, next: NextFunction) {
        try {
            const legajoId = parseInt(req.params.idLegajo);
            if (isNaN(legajoId)) throw new AppError('ID de legajo inválido', 400);

            const data = await legajoService.getMateriasPendientes(legajoId);
            res.status(200).json({ status: 'success', data });
        } catch (err) {
            next(err);
        }
    }
};