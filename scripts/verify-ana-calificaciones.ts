/**
 * Verificación rápida post-seed: datos de calificaciones de Ana Martínez.
 * Uso: npx tsx scripts/verify-ana-calificaciones.ts
 */
import dotenv from 'dotenv';
dotenv.config();

import { sequelize } from '../src/modules/index.js';
import Estudiante from '../src/modules/estudiantes/model/Estudiante.js';
import Legajo from '../src/modules/legajos/model/Legajo.js';
import EstudianteXUnidadCurricular from '../src/modules/estudiantesXUnidadCurricular/model/EstudianteXUnidadCurricular.js';
import LegajoXInstanciaEvaluativa from '../src/modules/legajosXInstanciasEvaluativas/model/LegajoXInstanciaEvaluativa.js';
import InstanciaEvaluativa from '../src/modules/instanciasEvaluativas/model/InstanciaEvaluativa.js';
import DivisionXUnidadCurricular from '../src/modules/divisionXUnidadCurricular/model/DivisionXUnidadCurricular.js';
import UnidadCurricular from '../src/modules/unidades_curriculares/model/UnidadCurricular.js';
import { legajoService } from '../src/modules/legajos/service/legajo.service.js';

async function main() {
  await sequelize.authenticate();

  const ana = await Estudiante.findOne({ where: { email: 'ana.martinez@correo.com' } });
  if (!ana) throw new Error('Estudiante Ana no encontrado');

  const legajo = await Legajo.findOne({ where: { idEstudiante: ana.id } });
  if (!legajo) throw new Error('Legajo de Ana no encontrado');

  const inscripciones = await EstudianteXUnidadCurricular.findAll({
    where: { idLegajo: legajo.id },
    attributes: ['idDivisionXUnidadCurricular', 'condicion'],
  });
  const dxucInscriptos = inscripciones.map((i) => i.idDivisionXUnidadCurricular);

  const notas = await LegajoXInstanciaEvaluativa.findAll({
    where: { idLegajo: legajo.id },
    include: [{ model: InstanciaEvaluativa, as: 'instanciaEvaluativa' }],
  });

  const unidades = await legajoService.getUnidadesCurricularesData(legajo.id);

  const alineado = notas.every(
    (n) => dxucInscriptos.includes(n.instanciaEvaluativa?.idDivisionXUnidadCurricular ?? -1),
  );

  console.log('--- Verificación Ana Martínez ---');
  console.log('idEstudiante:', ana.id);
  console.log('legajoId:', legajo.id);
  console.log('dxuc inscriptos:', dxucInscriptos);
  console.log('condición:', inscripciones.map((i) => i.condicion).join(', '));
  console.log(
    'notas:',
    notas.map((n) => ({
      nota: n.nota,
      dxuc: n.instanciaEvaluativa?.idDivisionXUnidadCurricular,
      tipo: n.instanciaEvaluativa?.tipo,
    })),
  );
  console.log(
    'unidades:',
    unidades.map((u) => ({
      nombre: u.nombre,
      promedio: u.promedio,
      condicion: u.condicion,
    })),
  );
  console.log('dxuc alineado (inscripción = nota):', alineado ? 'OK' : 'FALLO');

  if (!alineado || notas.length === 0 || notas[0].nota !== 6) {
    process.exitCode = 1;
    console.error('Verificación FALLIDA');
  } else {
    console.log('Verificación OK');
  }

  await sequelize.close();
}

main().catch(async (err) => {
  console.error(err);
  await sequelize.close();
  process.exit(1);
});
