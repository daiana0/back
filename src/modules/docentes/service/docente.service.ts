import Docente from '../model/Docente.js';
import type { CreateDocenteDto } from '../dto/create-docente.dto.js';
import type { UpdateDocenteDto } from '../dto/update-docente.dto.js';
import { DesignacionesDocente, DivisionXUnidadCurricular, Division, Curso, UnidadCurricular, EstudianteXUnidadCurricular, Legajo, Estudiante, InstanciaEvaluativa, LegajoXInstanciaEvaluativa } from '../../index.js';
import { asistenciaService } from '../../asistencia/service/asistencia.service.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

interface DesignacionDocenteWithRelations {
  idDivisionXUnidadCurricular: number;
  divisionXUnidadCurricular?: {
    id: number;
    division?: {
      id: number;
      curso?: {
        anioAcademico: number;
      };
    };
    unidadCurricular?: {
      nombre: string;
    };
  };
}

export const docenteService = {

  async getAsignacionAlumnos(idDivisionXUnidadCurricular: number) {
    const inscritos = await EstudianteXUnidadCurricular.findAll({
      where: { idDivisionXUnidadCurricular },
      include: [
        {
          model: Legajo,
          as: 'legajo',
          include: [
            {
              model: Estudiante,
              as: 'estudiante',
            }
          ]
        }
      ]
    });

    return inscritos.map((ins) => {
      const insWithRel = ins as any;
      const legajo = insWithRel.legajo;
      const estudiante = legajo?.estudiante;

      return {
        idLegajo: legajo?.id || 0,
        dni: estudiante?.dni || '',
        apellido: estudiante?.apellido || '',
        nombre: estudiante?.nombre || '',
        foto: estudiante?.foto || null,
      };
    });
  },

  async getMeAsignaciones(docenteId: number) {
    const designaciones = await DesignacionesDocente.findAll({
      where: { idDocente: docenteId, activo: true },
      include: [
        {
          model: DivisionXUnidadCurricular,
          as: 'divisionXUnidadCurricular',
          include: [
            {
              model: Division,
              as: 'division',
              include: [
                {
                  model: Curso,
                  as: 'curso',
                }
              ]
            },
            {
              model: UnidadCurricular,
              as: 'unidadCurricular',
            }
          ]
        }
      ]
    });

    return designaciones.map(d => {
      const dWithRel = d as unknown as DesignacionDocenteWithRelations;
      const dxuc = dWithRel.divisionXUnidadCurricular;
      const division = dxuc?.division;
      const curso = division?.curso;
      const uc = dxuc?.unidadCurricular;

      // Generar letra de división usando el ID (ej. 1 -> A, 2 -> B)
      const divisionLetter = division ? String.fromCharCode(65 + ((division.id - 1) % 26)) : 'A';
      const anio = curso?.anioAcademico ? `${curso.anioAcademico}°` : '';
      const materia = uc?.nombre || '';

      const descripcion = anio ? `${anio} ${divisionLetter} - ${materia}` : materia;

      return {
        idDivisionXUnidadCurricular: dxuc?.id || dWithRel.idDivisionXUnidadCurricular,
        descripcion
      };
    });
  },

  async validarPertenenciaDocente(docenteId: number, idDivisionXUnidadCurricular: number): Promise<boolean> {
    const designacion = await DesignacionesDocente.findOne({
      where: {
        idDocente: docenteId,
        idDivisionXUnidadCurricular,
        activo: true
      }
    });
    return !!designacion;
  },

  async getPanelAcademico(idDivisionXUnidadCurricular: number) {
    const dxuc = await DivisionXUnidadCurricular.findOne({
      where: { id: idDivisionXUnidadCurricular },
      include: [
        {
          model: Division,
          as: 'division',
          include: [
            {
              model: Curso,
              as: 'curso',
            }
          ]
        },
        {
          model: UnidadCurricular,
          as: 'unidadCurricular',
        }
      ]
    });

    if (!dxuc) {
      return null;
    }

    const divisionWithRel = dxuc as any;
    const division = divisionWithRel.division;
    const curso = division?.curso;
    const uc = divisionWithRel.unidadCurricular;

    const divisionLetter = division ? String.fromCharCode(65 + ((division.id - 1) % 26)) : 'A';
    const anio = curso?.anioAcademico ? `${curso.anioAcademico}°` : '';
    const materia = uc?.nombre || '';

    const asignacionInfo = {
      idDivisionXUnidadCurricular,
      materia,
      division: anio ? `${anio} ${divisionLetter}` : divisionLetter,
    };

    const inscritos = await EstudianteXUnidadCurricular.findAll({
      where: { idDivisionXUnidadCurricular },
      include: [
        {
          model: Legajo,
          as: 'legajo',
          include: [
            {
              model: Estudiante,
              as: 'estudiante',
            }
          ]
        }
      ],
      order: [
        [{ model: Legajo, as: 'legajo' }, { model: Estudiante, as: 'estudiante' }, 'apellido', 'ASC'],
        [{ model: Legajo, as: 'legajo' }, { model: Estudiante, as: 'estudiante' }, 'nombre', 'ASC']
      ]
    });

    const resumenAsistencia = await asistenciaService.getResumenAsistencia(idDivisionXUnidadCurricular);
    const totalClases = resumenAsistencia?.resumenComision?.totalClases || 0;
    const porcentajeAsistenciaGeneral = totalClases === 0 ? null : (resumenAsistencia?.resumenComision?.porcentajeGeneral ?? null);

    const evaluacionesDb = await InstanciaEvaluativa.findAll({
      where: { idDivisionXUnidadCurricular },
      order: [
        ['fecha', 'ASC'],
        ['id', 'ASC']
      ]
    });

    const idEvaluaciones = evaluacionesDb.map(e => e.id);
    const notasDb = idEvaluaciones.length > 0 ? await LegajoXInstanciaEvaluativa.findAll({
      where: {
        idInstanciaEvaluativa: idEvaluaciones
      },
      order: [
        ['fechaRegistro', 'DESC'],
        ['id', 'DESC']
      ]
    }) : [];

    const evaluaciones = evaluacionesDb.map(evalDb => {
      const notasDeEval = notasDb.filter(n => n.idInstanciaEvaluativa === evalDb.id && n.nota !== null);
      let promedio: number | null = null;
      if (notasDeEval.length > 0) {
        const suma = notasDeEval.reduce((acc, curr) => acc + curr.nota, 0);
        promedio = Math.round((suma / notasDeEval.length) * 10) / 10;
      }
      return {
        id: evalDb.id,
        descripcion: evalDb.descripcion,
        tipo: evalDb.tipo,
        fecha: typeof evalDb.fecha === 'string' ? evalDb.fecha : new Date(evalDb.fecha).toISOString().split('T')[0],
        promedio
      };
    });

    let promocionados = 0;
    let regulares = 0;
    let libres = 0;

    const alumnos = inscritos.map(ins => {
      const insWithRel = ins as any;
      const legajo = insWithRel.legajo;
      const estudiante = legajo?.estudiante;
      const idLegajo = legajo?.id || 0;
      const condicion = ins.condicion || 'regular';

      if (condicion === 'promocionado') promocionados++;
      else if (condicion === 'regular') regulares++;
      else if (condicion === 'libre') libres++;

      const alumnoAsistenciaResumen = resumenAsistencia?.alumnos?.find(al => al.idLegajo === idLegajo);
      const porcentajeAsistencia = totalClases === 0 ? null : (alumnoAsistenciaResumen ? alumnoAsistenciaResumen.porcentajeAsistencia : 0);
      const asistenciaInsuficiente = porcentajeAsistencia !== null && porcentajeAsistencia < 75;

      const notas: Record<string, number | null> = {};
      evaluacionesDb.forEach(evalDb => {
        const notaRecord = notasDb.find(n => n.idLegajo === idLegajo && n.idInstanciaEvaluativa === evalDb.id);
        notas[evalDb.id.toString()] = notaRecord ? notaRecord.nota : null;
      });

      return {
        idLegajo,
        dni: estudiante?.dni || '',
        apellido: estudiante?.apellido || '',
        nombre: estudiante?.nombre || '',
        condicion,
        porcentajeAsistencia,
        asistenciaInsuficiente,
        notas
      };
    });

    const totalAlumnos = alumnos.length;
    const porcentajePromocionados = totalAlumnos > 0 ? Math.round((promocionados / totalAlumnos) * 100) : 0;
    const porcentajeRegulares = totalAlumnos > 0 ? Math.round((regulares / totalAlumnos) * 100) : 0;
    const porcentajeLibres = totalAlumnos > 0 ? Math.round((libres / totalAlumnos) * 100) : 0;

    const estadisticas = {
      totalAlumnos,
      totalEvaluaciones: evaluaciones.length,
      totalClases,
      promocionados,
      regulares,
      libres,
      porcentajePromocionados,
      porcentajeRegulares,
      porcentajeLibres,
      porcentajeAsistenciaGeneral
    };

    return {
      asignacion: asignacionInfo,
      evaluaciones,
      alumnos,
      estadisticas,
      meta: {
        total: totalAlumnos
      }
    };
  },

  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await Docente.findAndCountAll({
      limit,
      offset,
      order: [['id', 'ASC']],
      attributes: { exclude: ['contrasenia'] },
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
    return Docente.findByPk(id, {
      attributes: { exclude: ['contrasenia'] },
    });
  },

  async create(data: CreateDocenteDto) {
    return Docente.create(data as any);
  },

  async update(id: number, data: UpdateDocenteDto) {
    const docente = await Docente.findByPk(id);
    if (!docente) return null;
    await docente.update(data);
    return Docente.findByPk(id, {
      attributes: { exclude: ['contrasenia'] },
    });
  },

  async delete(id: number) {
    const docente = await Docente.findByPk(id);
    if (!docente) return null;
    await docente.destroy();
    return true;
  },
};