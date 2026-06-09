import Legajo from '../model/Legajo.js';
import type { CreateLegajoDto } from '../dto/create-legajo.dto.js';
import type { UpdateLegajoDto } from '../dto/update-legajo.dto.js';
import Asistencia from '../../asistencia/model/Asistencia.js';
import EstudianteXUnidadCurricular from '../../estudiantesXUnidadCurricular/model/EstudianteXUnidadCurricular.js';
import DivisionXUnidadCurricular from '../../divisionXUnidadCurricular/model/DivisionXUnidadCurricular.js';
import UnidadCurricular from '../../unidades_curriculares/model/UnidadCurricular.js';
import LegajoXInstanciaEvaluativa from '../../legajosXInstanciasEvaluativas/model/LegajoXInstanciaEvaluativa.js';
import InstanciaEvaluativa from '../../instanciasEvaluativas/model/InstanciaEvaluativa.js';
import PlanEstudio from '../../planes_estudios/model/PlanEstudio.js';
import Carrera from '../../carreras/model/Carrera.js';
import Administrativo from '../../administrativos/model/Administrativo.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const legajoService = {
    async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
        const offset = (page - 1) * limit;
        const { count, rows } = await Legajo.findAndCountAll({
            limit,
            offset,
            order: [['id', 'ASC']],
        });
        return {
            data: rows,
            meta: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            },
        };
    },

    async getById(id: number) {
        return Legajo.findByPk(id);
    },

    async getByIdWithDetails(id: number) {
        return Legajo.findByPk(id, {
            include: [
                {
                    model: PlanEstudio,
                    as: 'planEstudio',
                    attributes: ['id', 'version', 'fechaDeAprobacion', 'duracionEnAnios', 'estado'],
                    include: [
                        {
                            model: Carrera,
                            as: 'carrera',
                            attributes: ['id', 'nombre', 'tipo', 'codigo']
                        }
                    ]
                },
                {
                    model: Administrativo,
                    as: 'administrativo',
                    attributes: ['id', 'nombre', 'apellido', 'email']
                }
            ]
        });
    },

    async create(data: CreateLegajoDto) {
        return Legajo.create(data as any);
    },

    async update(id: number, data: UpdateLegajoDto) {
        const legajo = await Legajo.findByPk(id);
        if (!legajo) return null;
        await legajo.update(data);
        return legajo.reload();
    },

    async delete(id: number) {
        const legajo = await Legajo.findByPk(id);
        if (!legajo) return null;
        await legajo.destroy();
        return true;
    },

    async getPorcentajesAsistenciaPorLegajo(legajoId: number): Promise<Map<number, number>> {
        const asistencias = await Asistencia.findAll({
            where: { idLegajo: legajoId },
            attributes: ['idDivisionXUnidadCurricular', 'presente']
        });

        const asistenciaMap = new Map<number, { total: number; presentes: number }>();
        for (const a of asistencias) {
            const divisionId = a.idDivisionXUnidadCurricular;
            if (!asistenciaMap.has(divisionId)) {
                asistenciaMap.set(divisionId, { total: 0, presentes: 0 });
            }
            const stats = asistenciaMap.get(divisionId)!;
            stats.total++;
            if (a.presente) stats.presentes++;
        }

        // Convertir a Map<number, number> (porcentaje)
        const porcentajes = new Map<number, number>();
        for (const [divisionId, stats] of asistenciaMap.entries()) {
            const porcentaje = stats.total === 0 ? 0 : Math.round((stats.presentes / stats.total) * 100);
            porcentajes.set(divisionId, porcentaje);
        }
        return porcentajes;
    },

    async getUnidadesCurricularesData(legajoId: number) {
        // 1. Obtener todas las inscripciones del legajo con sus relaciones
        const inscripciones = await EstudianteXUnidadCurricular.findAll({
            where: { idLegajo: legajoId },
            include: [
                {
                    model: DivisionXUnidadCurricular,
                    as: 'divisionXUnidadCurricular',
                    include: [
                        {
                            model: UnidadCurricular,
                            as: 'unidadCurricular',
                            attributes: ['id', 'nombre']
                        }
                    ]
                }
            ]
        });

        if (!inscripciones.length) return [];

        // 2. Obtener mapa de asistencias 
        const asistenciaMap = await legajoService.getPorcentajesAsistenciaPorLegajo(legajoId);

        // 3. Para cada inscripción, calcular promedio de notas y armar objeto
        const resultados = await Promise.all(
            inscripciones.map(async (insc) => {
                const division = insc.divisionXUnidadCurricular;
                const uc = division?.unidadCurricular;
                if (!uc) return null;

                const porcentajeAsistencia = asistenciaMap.get(division.id) || 0;

                // Obtener todas las notas del legajo para esta división
                const notas = await LegajoXInstanciaEvaluativa.findAll({
                    where: { idLegajo: legajoId },
                    include: [
                        {
                            model: InstanciaEvaluativa,
                            as: 'instanciaEvaluativa',
                            where: { idDivisionXUnidadCurricular: division.id },
                            attributes: []
                        }
                    ],
                    attributes: ['nota']
                });

                const notasValidas = notas.map(n => n.nota).filter(n => n !== null);
                const promedio = notasValidas.length
                    ? parseFloat((notasValidas.reduce((a, b) => a + b, 0) / notasValidas.length).toFixed(1))
                    : null;

                return {
                    id: insc.id,
                    nombre: uc.nombre,
                    promedio,
                    condicion: insc.condicion,
                    porcentajeAsistencia
                };
            })
        );

        return resultados.filter(r => r !== null);
    },

    async getMateriasPendientes(legajoId: number) {
        const legajo = await Legajo.findByPk(legajoId, {
            attributes: ['idPlanEstudio']
        });
        if (!legajo) return [];

        const todasLasUCs = await UnidadCurricular.findAll({
            where: { idPlanEstudio: legajo.idPlanEstudio },
            attributes: ['id', 'nombre', 'duracion', 'cargaHoraria', 'cuatrimestre']
        });

        const inscripciones = await EstudianteXUnidadCurricular.findAll({
            where: { idLegajo: legajoId },
            attributes: ['idDivisionXUnidadCurricular'],
            include: [
                {
                    model: DivisionXUnidadCurricular,
                    as: 'divisionXUnidadCurricular',
                    attributes: ['idUnidadCurricular'],
                    include: [
                        {
                            model: UnidadCurricular,
                            as: 'unidadCurricular',
                            attributes: ['id']
                        }
                    ]
                }
            ]
        });

        const inscriptasIds = new Set(
            inscripciones
                .map(i => i.divisionXUnidadCurricular?.unidadCurricular?.id)
                .filter(Boolean)
        );

        const pendientes = todasLasUCs.filter(uc => !inscriptasIds.has(uc.id));

        return pendientes.map(uc => ({
            id: uc.id,
            nombre: uc.nombre,
            duracion: uc.duracion,
            cargaHoraria: uc.cargaHoraria,
            cuatrimestre: uc.cuatrimestre
        }));
    },

    async getTotalMateriasPlan(idPlanEstudio: number): Promise<number> {
        return UnidadCurricular.count({
            where: { idPlanEstudio }
        });
    }
};