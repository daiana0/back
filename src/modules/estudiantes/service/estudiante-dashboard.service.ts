import { Op } from 'sequelize';
import {
  Estudiante,
  Legajo,
  CicloLectivo,
  EstudianteXUnidadCurricular,
  DivisionXUnidadCurricular,
  Division,
  Curso,
  UnidadCurricular,
  DesignacionesDocente,
  Docente,
  LegajoXInstanciaEvaluativa,
  InstanciaEvaluativa,
  Asistencia,
  MesaExamen,
  TurnoExamen,
  MesaExamenXLegajo,
  Notificacion,
} from '../../index.js';

const DOCENTE_ATTRIBUTES = ['id', 'nombre', 'apellido', 'email', 'titulo', 'especialidad', 'foto'] as const;

type DesignacionConDocente = DesignacionesDocente & {
  docente?: Docente;
};

type InscripcionConRelaciones = EstudianteXUnidadCurricular & {
  divisionXUnidadCurricular?: DivisionXUnidadCurricular & {
    unidadCurricular?: UnidadCurricular;
  };
};

type MesaConRelaciones = MesaExamen & {
  unidadCurricular?: UnidadCurricular;
};

interface DashboardUnidadCurricular {
  id: number;
  idInscripcion: number;
  nombre: string;
  condicion: 'promocionado' | 'regular' | 'libre';
  fechaDeInscripcion: string;
  cargaHoraria: number;
  duracion: 'anual' | 'cuatrimestral';
  cuatrimestre: 'primero' | 'segundo' | null;
  docentes: Array<{
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    titulo: string;
    especialidad: string | null;
    foto: string | null;
    turno: string;
    horario: string;
    aula: string | null;
  }>;
}

interface DashboardMesaExamen {
  id: number;
  fecha: Date;
  hora: string;
  tipo: string;
  categoria: string;
  unidadCurricular: { id: number; nombre: string };
  inscripto: boolean;
}

interface DashboardNotificacion {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: string;
  leida: boolean;
  fechaCreacion: Date;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function todayDateOnly(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildCicloActivoInclude(idCicloLectivo: number) {
  return {
    model: Division,
    as: 'division',
    required: true,
    include: [
      {
        model: Curso,
        as: 'curso',
        required: true,
        where: { idCicloLectivo },
      },
    ],
  };
}

function mapDocentes(designaciones: DesignacionConDocente[]) {
  return designaciones.flatMap((d) => {
    if (!d.docente) return [];
    return [{
      id: d.docente.id,
      nombre: d.docente.nombre,
      apellido: d.docente.apellido,
      email: d.docente.email,
      titulo: d.docente.titulo,
      especialidad: d.docente.especialidad,
      foto: d.docente.foto,
      turno: d.turno,
      horario: d.horario,
      aula: d.aula,
    }];
  });
}

function emptyDashboard(idEstudiante: number) {
  return {
    idEstudiante,
    idLegajo: null as number | null,
    cicloLectivo: null as { id: number; anio: number } | null,
    cantidadUnidadesCurricularesCursadas: 0,
    promedioNotas: null as number | null,
    porcentajeAsistencia: null as number | null,
    unidadesCurriculares: [] as DashboardUnidadCurricular[],
    proximasMesasExamen: [] as DashboardMesaExamen[],
    notificacionesRecientes: [] as DashboardNotificacion[],
  };
}

function mapUnidadCurricular(
  inscripcion: InscripcionConRelaciones,
  designaciones: DesignacionConDocente[],
): DashboardUnidadCurricular {
  const uc = inscripcion.divisionXUnidadCurricular!.unidadCurricular!;
  return {
    id: uc.id,
    idInscripcion: inscripcion.id,
    nombre: uc.nombre,
    condicion: inscripcion.condicion,
    fechaDeInscripcion: inscripcion.fechaDeInscripcion,
    cargaHoraria: uc.cargaHoraria,
    duracion: uc.duracion,
    cuatrimestre: uc.cuatrimestre,
    docentes: mapDocentes(designaciones),
  };
}

async function fetchInscripcionesCicloActivo(idLegajo: number, idCicloLectivo: number) {
  return EstudianteXUnidadCurricular.findAll({
    where: { idLegajo },
    include: [
      {
        model: DivisionXUnidadCurricular,
        as: 'divisionXUnidadCurricular',
        required: true,
        include: [
          {
            model: UnidadCurricular,
            as: 'unidadCurricular',
            required: true,
          },
          buildCicloActivoInclude(idCicloLectivo),
        ],
      },
    ],
  });
}

async function fetchDesignacionesPorDxuc(
  dxucIds: number[],
  idCicloLectivo: number,
): Promise<Map<number, DesignacionConDocente[]>> {
  if (dxucIds.length === 0) return new Map();

  const designaciones = (await DesignacionesDocente.findAll({
    where: {
      idDivisionXUnidadCurricular: { [Op.in]: dxucIds },
      idCicloLectivo,
      activo: true,
    },
    include: [
      {
        model: Docente,
        as: 'docente',
        attributes: [...DOCENTE_ATTRIBUTES],
      },
    ],
  })) as DesignacionConDocente[];

  const map = new Map<number, DesignacionConDocente[]>();
  for (const d of designaciones) {
    const list = map.get(d.idDivisionXUnidadCurricular) ?? [];
    list.push(d);
    map.set(d.idDivisionXUnidadCurricular, list);
  }
  return map;
}

async function calcularPromedioNotas(idLegajo: number, idCicloLectivo: number): Promise<number | null> {
  const notas = await LegajoXInstanciaEvaluativa.findAll({
    where: { idLegajo },
    attributes: ['nota'],
    include: [
      {
        model: InstanciaEvaluativa,
        as: 'instanciaEvaluativa',
        required: true,
        include: [
          {
            model: DivisionXUnidadCurricular,
            as: 'divisionXUnidadCurricular',
            required: true,
            include: [buildCicloActivoInclude(idCicloLectivo)],
          },
        ],
      },
    ],
  });

  if (notas.length === 0) return null;
  const sum = notas.reduce((acc, n) => acc + n.nota, 0);
  return round2(sum / notas.length);
}

async function calcularPorcentajeAsistencia(
  idLegajo: number,
  idCicloLectivo: number,
): Promise<number | null> {
  const registros = await Asistencia.findAll({
    where: { idLegajo },
    attributes: ['presente'],
    include: [
      {
        model: DivisionXUnidadCurricular,
        as: 'divisionXUnidadCurricular',
        required: true,
        include: [buildCicloActivoInclude(idCicloLectivo)],
      },
    ],
  });

  if (registros.length === 0) return null;
  const presentes = registros.filter((r) => r.presente).length;
  return round2((presentes / registros.length) * 100);
}

async function fetchProximasMesas(
  ucIds: number[],
  idCicloLectivo: number,
  idLegajo: number,
): Promise<DashboardMesaExamen[]> {
  if (ucIds.length === 0) return [];

  const mesas = (await MesaExamen.findAll({
    where: {
      idUnidadCurricular: { [Op.in]: ucIds },
      fecha: { [Op.gte]: todayDateOnly() },
      activo: true,
    },
    include: [
      {
        model: UnidadCurricular,
        as: 'unidadCurricular',
        attributes: ['id', 'nombre'],
      },
      {
        model: TurnoExamen,
        as: 'turnoExamen',
        required: true,
        where: { idCicloLectivo },
      },
    ],
    order: [
      ['fecha', 'ASC'],
      ['hora', 'ASC'],
    ],
  })) as MesaConRelaciones[];

  const mesaIds = mesas.map((m) => m.id);
  const inscripciones =
    mesaIds.length > 0
      ? await MesaExamenXLegajo.findAll({
          where: { idLegajo, idMesaExamen: { [Op.in]: mesaIds } },
          attributes: ['idMesaExamen'],
        })
      : [];

  const inscriptoSet = new Set(inscripciones.map((i) => i.idMesaExamen));

  return mesas.map((mesa) => ({
    id: mesa.id,
    fecha: mesa.fecha,
    hora: mesa.hora,
    tipo: mesa.tipo,
    categoria: mesa.categoria,
    unidadCurricular: {
      id: mesa.unidadCurricular!.id,
      nombre: mesa.unidadCurricular!.nombre,
    },
    inscripto: inscriptoSet.has(mesa.id),
  }));
}

export const estudianteDashboardService = {
  async getDashboard(idEstudiante: number) {
    const estudiante = await Estudiante.findByPk(idEstudiante);
    if (!estudiante) return null;

    const legajo = await Legajo.findOne({
      where: { idEstudiante, activo: true },
    });

    if (!legajo) return emptyDashboard(idEstudiante);

    const cicloActivo = await CicloLectivo.findOne({
      where: { activo: true, idPlanEstudio: legajo.idPlanEstudio },
    });

    if (!cicloActivo) return { ...emptyDashboard(idEstudiante), idLegajo: legajo.id };

    const inscripciones = await fetchInscripcionesCicloActivo(legajo.id, cicloActivo.id);
    const dxucIds = inscripciones.map((i) => i.idDivisionXUnidadCurricular);
    const designacionesMap = await fetchDesignacionesPorDxuc(dxucIds, cicloActivo.id);

    const unidadesCurriculares = (inscripciones as InscripcionConRelaciones[]).map((inscripcion) =>
      mapUnidadCurricular(
        inscripcion,
        designacionesMap.get(inscripcion.idDivisionXUnidadCurricular) ?? [],
      ),
    );

    const ucIds = [...new Set(unidadesCurriculares.map((uc) => uc.id))];

    const [promedioNotas, porcentajeAsistencia, proximasMesasExamen, notificacionesRecientes] = await Promise.all([
      calcularPromedioNotas(legajo.id, cicloActivo.id),
      calcularPorcentajeAsistencia(legajo.id, cicloActivo.id),
      fetchProximasMesas(ucIds, cicloActivo.id, legajo.id),
      Notificacion.findAll({
        where: { idEstudiante, leida: false },
        order: [['fechaCreacion', 'DESC']],
        limit: 5,
        attributes: ['id', 'titulo', 'mensaje', 'tipo', 'leida', 'fechaCreacion'],
      }),
    ]);

    return {
      idEstudiante,
      idLegajo: legajo.id,
      cicloLectivo: { id: cicloActivo.id, anio: cicloActivo.anio },
      cantidadUnidadesCurricularesCursadas: unidadesCurriculares.length,
      promedioNotas,
      porcentajeAsistencia,
      unidadesCurriculares,
      proximasMesasExamen,
      notificacionesRecientes: notificacionesRecientes.map((n) => ({
        id: n.id,
        titulo: n.titulo,
        mensaje: n.mensaje,
        tipo: n.tipo,
        leida: n.leida,
        fechaCreacion: n.fechaCreacion,
      })),
    };
  },

  async belongsToUsuario(idEstudiante: number, idUsuario: number): Promise<boolean> {
    const estudiante = await Estudiante.findByPk(idEstudiante, {
      attributes: ['id', 'idUsuario'],
    });
    return estudiante?.idUsuario === idUsuario;
  },
};
