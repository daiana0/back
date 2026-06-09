import {
  sequelize,
  Asistencia,
  EstudianteXUnidadCurricular,
  Legajo,
  Estudiante,
  Docente,
  DivisionXUnidadCurricular,
  UnidadCurricular,
  Division,
  Curso,
  Administrativo
} from '../../index.js';
import type { CreateAsistenciaDto } from '../dto/create-asistencia.dto.js';
import type { UpdateAsistenciaDto } from '../dto/update-asistencia.dto.js';
import { Op } from 'sequelize';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

interface EstudianteXUnidadCurricularWithRelations {
  legajo?: {
    id: number;
    numeroLegajo: number;
    estudiante?: {
      dni: string;
      nombre: string;
      apellido: string;
      foto: string | null;
    };
  };
}

interface AsistenciaResumenMateria {
  id: number;
  materia: string;
  division: string;
  cuatrimestre: 'primero' | 'segundo' | null;
  duracion: 'anual' | 'cuatrimestral';
  presentes: number;
  ausentes: number;
  porcentaje: number;
  estado: 'Regular' | 'En riesgo';
}

interface AsistenciaDetalle {
  id: number;
  fecha: string;
  materia: string;
  division: string;
  idUnidadCurricular: number;
  cuatrimestre: 'primero' | 'segundo' | null;
  duracion: 'anual' | 'cuatrimestral';
  estado: 'Presente' | 'Ausente';
  registro: string;
}

interface AsistenciaEstudianteResponse {
  asistenciaGeneral: number;
  resumenMaterias: AsistenciaResumenMateria[];
  detalles: AsistenciaDetalle[];
}

function formatFecha(fecha: Date | string): string {
  const date = typeof fecha === 'string' ? new Date(`${fecha}T00:00:00`) : fecha;
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function buildDivisionLabel(division?: Division & { curso?: Curso }): string {
  if (!division) return '—';
  const anio = division.curso?.anioAcademico;
  return anio != null ? `${anio}º` : `División ${division.id}`;
}

type DxucConRelaciones = DivisionXUnidadCurricular & {
  unidadCurricular?: UnidadCurricular;
  division?: Division & { curso?: Curso };
};

type InscripcionConRelaciones = EstudianteXUnidadCurricular & {
  divisionXUnidadCurricular?: DxucConRelaciones;
};

type RegistroConRelaciones = Asistencia & {
  divisionXUnidadCurricular?: DxucConRelaciones;
  administrativo?: Administrativo;
};

async function buildDivisionPorUnidadCurricular(idLegajo: number): Promise<Map<number, string>> {
  const inscripciones = (await EstudianteXUnidadCurricular.findAll({
    where: { idLegajo },
    include: [
      {
        model: DivisionXUnidadCurricular,
        as: 'divisionXUnidadCurricular',
        include: [
          { model: UnidadCurricular, as: 'unidadCurricular', attributes: ['id'] },
          {
            model: Division,
            as: 'division',
            include: [{ model: Curso, as: 'curso', attributes: ['anioAcademico'] }],
          },
        ],
      },
    ],
  })) as InscripcionConRelaciones[];

  const divisionPorUc = new Map<number, string>();
  for (const inscripcion of inscripciones) {
    const ucId = inscripcion.divisionXUnidadCurricular?.unidadCurricular?.id;
    if (ucId == null || divisionPorUc.has(ucId)) continue;
    divisionPorUc.set(
      ucId,
      buildDivisionLabel(inscripcion.divisionXUnidadCurricular?.division),
    );
  }
  return divisionPorUc;
}

export const asistenciaService = {

  async getAsistenciaPorAsignacionYFecha(idDivisionXUnidadCurricular: number, fecha: string) {
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

    const asistenciasCargadas = await Asistencia.findAll({
      where: { idDivisionXUnidadCurricular, fecha }
    });

    const alumnos = inscritos.map(ins => {
      const insWithRel = ins as unknown as EstudianteXUnidadCurricularWithRelations;
      const legajo = insWithRel.legajo;
      const estudiante = legajo?.estudiante;
      const asistencia = asistenciasCargadas.find(a => a.idLegajo === legajo?.id);

      return {
        idLegajo: legajo?.id,
        numeroLegajo: legajo?.numeroLegajo,
        dni: estudiante?.dni,
        nombreCompleto: estudiante ? `${estudiante.apellido}, ${estudiante.nombre}` : '',
        foto: estudiante?.foto || null,
        presente: asistencia ? asistencia.presente : null
      };
    });

    return {
      modo: asistenciasCargadas.length > 0 ? 'EDICION' : 'CREACION',
      alumnos
    };
  },

  async registrarAsistenciaMasiva(
    payload: { idDivisionXUnidadCurricular: number, fecha: string, asistencias: { idLegajo: number, presente: boolean }[] },
    userId: number,
    userRole: string
  ) {
    let idAdministrativo = userId;

    if (userRole === 'DOCENTE') {
      const docente = await Docente.findByPk(userId);
      if (docente) {
        idAdministrativo = docente.idAdministrativo;
      }
    }

    const transaction = await sequelize.transaction();
    try {
      for (const item of payload.asistencias) {
        const existing = await Asistencia.findOne({
          where: {
            idDivisionXUnidadCurricular: payload.idDivisionXUnidadCurricular,
            fecha: payload.fecha,
            idLegajo: item.idLegajo
          },
          transaction
        });

        if (existing) {
          await existing.update({
            presente: item.presente,
            idAdministrativo
          }, { transaction });
        } else {
          await Asistencia.create({
            idDivisionXUnidadCurricular: payload.idDivisionXUnidadCurricular,
            fecha: payload.fecha as unknown as Date,
            idLegajo: item.idLegajo,
            presente: item.presente,
            idAdministrativo
          } as unknown as Asistencia, { transaction });
        }
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async getResumenAsistencia(idDivisionXUnidadCurricular: number, mes?: string) {
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

    const whereClause: any = { idDivisionXUnidadCurricular };
    if (mes) {
      const [yearStr, monthStr] = mes.split('-');
      const year = parseInt(yearStr);
      const month = parseInt(monthStr);
      const startDate = `${mes}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${mes}-${lastDay.toString().padStart(2, '0')}`;
      whereClause.fecha = {
        [Op.between]: [startDate, endDate]
      };
    }

    const asistencias = await Asistencia.findAll({
      where: whereClause
    });

    // unique dates with attendance records in the selected month for the division
    // Sorted chronologically (oldest to newest)
    const uniqueDates = Array.from(
      new Set(
        asistencias.map(a => {
          if (typeof a.fecha === 'string') return a.fecha;
          return new Date(a.fecha).toISOString().split('T')[0];
        })
      )
    ).sort((a, b) => a.localeCompare(b));

    const totalClases = uniqueDates.length;
    const cantidadAlumnos = inscritos.length;

    let totalPresentesComision = 0;

    const alumnos = inscritos.map(ins => {
      const insWithRel = ins as unknown as EstudianteXUnidadCurricularWithRelations;
      const legajo = insWithRel.legajo;
      const estudiante = legajo?.estudiante;
      
      const alumnoAsistencias = asistencias.filter(a => a.idLegajo === legajo?.id);
      const presentes = alumnoAsistencias.filter(a => a.presente).length;

      totalPresentesComision += presentes;

      const porcentajeAsistencia = totalClases > 0 ? Math.round((presentes / totalClases) * 100) : 0;

      // SUPOSICION DOCUMENTADA: La ausencia de un registro de asistencia individual para un alumno
      // en una fecha de clase válida (es decir, una fecha con al menos una asistencia registrada en la comisión)
      // se interpreta por defecto como ausente (presente = false) bajo el supuesto de que la carga de asistencia
      // en el sistema se realiza de manera masiva y completa para todos los alumnos inscriptos.
      const asistenciasDetalle = uniqueDates.map(fechaStr => {
        const record = alumnoAsistencias.find(a => {
          const aFechaStr = typeof a.fecha === 'string' ? a.fecha : new Date(a.fecha).toISOString().split('T')[0];
          return aFechaStr === fechaStr;
        });
        return {
          fecha: fechaStr,
          presente: record ? record.presente : false
        };
      });

      return {
        idLegajo: legajo?.id || 0,
        dni: estudiante?.dni || '',
        apellido: estudiante?.apellido || '',
        nombre: estudiante?.nombre || '',
        porcentajeAsistencia,
        asistencias: asistenciasDetalle
      };
    });

    const alumnosDebajoMinimo = alumnos.filter(al => al.porcentajeAsistencia < 75).length;

    const totalDeAsistenciasPosibles = totalClases * cantidadAlumnos;
    const porcentajeGeneral = totalDeAsistenciasPosibles > 0 
      ? Math.round((totalPresentesComision / totalDeAsistenciasPosibles) * 100)
      : 0;

    return {
      resumenComision: {
        porcentajeGeneral,
        alumnosDebajoMinimo,
        totalClases
      },
      alumnos
    };
  },

  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await Asistencia.findAndCountAll({
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
    return Asistencia.findByPk(id);
  },

  async getByEstudianteId(estudianteId: number): Promise<AsistenciaEstudianteResponse | null> {
    const legajo = await Legajo.findOne({
      where: { idEstudiante: estudianteId, activo: true },
    });

    if (!legajo) {
      return {
        asistenciaGeneral: 0,
        resumenMaterias: [],
        detalles: [],
      };
    }

    const registros = await Asistencia.findAll({
      where: { idLegajo: legajo.id },
      include: [
        {
          model: DivisionXUnidadCurricular,
          as: 'divisionXUnidadCurricular',
          include: [
            {
              model: UnidadCurricular,
              as: 'unidadCurricular',
              attributes: ['id', 'nombre', 'cuatrimestre', 'duracion'],
            },
            {
              model: Division,
              as: 'division',
              include: [{ model: Curso, as: 'curso', attributes: ['anioAcademico'] }],
            },
          ],
        },
        {
          model: Administrativo,
          as: 'administrativo',
          attributes: ['nombre', 'apellido'],
        },
      ],
      order: [['fecha', 'DESC']],
    });

    if (registros.length === 0) {
      return {
        asistenciaGeneral: 0,
        resumenMaterias: [],
        detalles: [],
      };
    }

    const divisionPorUc = await buildDivisionPorUnidadCurricular(legajo.id);

    const resumenMap = new Map<number, {
      id: number;
      materia: string;
      division: string;
      cuatrimestre: 'primero' | 'segundo' | null;
      duracion: 'anual' | 'cuatrimestral';
      presentes: number;
      ausentes: number;
    }>();

    const detalles: AsistenciaDetalle[] = [];

    for (const registro of registros as RegistroConRelaciones[]) {
      const dxuc = registro.divisionXUnidadCurricular;
      const uc = dxuc?.unidadCurricular;
      if (!uc || uc.id == null) continue;
      const ucId = uc.id;

      const materia = uc.nombre ?? 'Materia';
      const division = divisionPorUc.get(ucId) ?? buildDivisionLabel(dxuc?.division);
      const cuatrimestre = uc.cuatrimestre ?? null;
      const duracion = uc.duracion;

      if (!resumenMap.has(ucId)) {
        resumenMap.set(ucId, {
          id: ucId,
          materia,
          division,
          cuatrimestre,
          duracion,
          presentes: 0,
          ausentes: 0,
        });
      }

      const stats = resumenMap.get(ucId)!;
      if (registro.presente) stats.presentes++;
      else stats.ausentes++;

      const admin = registro.administrativo;
      const registroNombre = admin
        ? `${admin.nombre} ${admin.apellido}`.trim()
        : 'Sistema';

      detalles.push({
        id: registro.id,
        fecha: formatFecha(registro.fecha),
        materia,
        division,
        idUnidadCurricular: ucId,
        cuatrimestre,
        duracion,
        estado: registro.presente ? 'Presente' : 'Ausente',
        registro: registroNombre,
      });
    }

    const resumenMaterias: AsistenciaResumenMateria[] = Array.from(resumenMap.values()).map((item) => {
      const total = item.presentes + item.ausentes;
      const porcentaje = total > 0 ? Math.round((item.presentes / total) * 100) : 0;
      return {
        ...item,
        porcentaje,
        estado: porcentaje >= 75 ? 'Regular' : 'En riesgo',
      };
    });

    const totalPresentes = resumenMaterias.reduce((acc, m) => acc + m.presentes, 0);
    const totalRegistros = resumenMaterias.reduce((acc, m) => acc + m.presentes + m.ausentes, 0);
    const asistenciaGeneral = totalRegistros > 0
      ? Math.round((totalPresentes / totalRegistros) * 100)
      : 0;

    return {
      asistenciaGeneral,
      resumenMaterias,
      detalles,
    };
  },

  async create(data: CreateAsistenciaDto) {
    return Asistencia.create(data as any);
  },

  async update(id: number, data: UpdateAsistenciaDto) {
    const record = await Asistencia.findByPk(id);
    if (!record) return null;
    await record.update(data as any);
    return record;
  },

  async delete(id: number) {
    const record = await Asistencia.findByPk(id);
    if (!record) return null;
    await record.destroy();
    return true;
  },
};
