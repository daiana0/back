import dotenv from 'dotenv';
dotenv.config();

import { docenteService } from '../src/modules/docentes/service/docente.service.js';
import { asistenciaService } from '../src/modules/asistencia/service/asistencia.service.js';
import sequelize from '../src/config/database/conexion.js';

async function run() {
  try {
    console.log('--- STARTING ATTENDANCE HISTORY AUTOMATED TESTS ---');

    // 1. Find a docente and their assignments to use as test data
    console.log('\nStep 1: Finding an active docente and their assignments...');
    const query = `
      SELECT dd.id_docente, dd.id_division_x_unidad_curricular
      FROM designaciones_docentes dd
      WHERE dd.activo = true
      LIMIT 1
    `;
    const [result] = await sequelize.query(query);
    if (result.length === 0) {
      console.log('❌ No active designaciones_docentes found. Cannot run test.');
      process.exit(1);
    }

    const testDocente = result[0] as { id_docente: number; id_division_x_unidad_curricular: number };
    const docenteId = testDocente.id_docente;
    const divisionId = testDocente.id_division_x_unidad_curricular;

    console.log(`Found docente ID: ${docenteId}, assigned to division: ${divisionId}`);

    // 2. Validate membership checks
    console.log('\nStep 2: Testing validarPertenenciaDocente...');
    const isValidAssignment = await docenteService.validarPertenenciaDocente(docenteId, divisionId);
    console.log(`Is valid assignment (expected: true): ${isValidAssignment}`);
    if (!isValidAssignment) {
      throw new Error('validarPertenenciaDocente returned false for a known valid assignment!');
    }

    const isInvalidAssignment = await docenteService.validarPertenenciaDocente(docenteId, 99999);
    console.log(`Is invalid assignment (expected: false): ${isInvalidAssignment}`);
    if (isInvalidAssignment) {
      throw new Error('validarPertenenciaDocente returned true for a non-existing assignment!');
    }
    console.log('✅ validarPertenenciaDocente tests passed.');

    // 3. Test getResumenAsistencia and its calculations
    console.log('\nStep 3: Testing getResumenAsistencia without month filter...');
    const resumenGlobal = await asistenciaService.getResumenAsistencia(divisionId);

    console.log('Global summary keys:', Object.keys(resumenGlobal));
    console.log('Global summary - resumenComision:', resumenGlobal.resumenComision);
    console.log(`Global summary - Number of students: ${resumenGlobal.alumnos.length}`);

    // Assert calculations
    const { totalClases, porcentajeGeneral, alumnosDebajoMinimo } = resumenGlobal.resumenComision;
    if (typeof totalClases !== 'number' || typeof porcentajeGeneral !== 'number' || typeof alumnosDebajoMinimo !== 'number') {
      throw new Error('resumenComision fields must be numbers!');
    }

    // Verify individual percentages
    console.log('\nStep 4: Verifying individual student calculations...');
    resumenGlobal.alumnos.forEach((alumno: any) => {
      const { idLegajo, dni, apellido, nombre, porcentajeAsistencia, asistencias } = alumno;
      const totalAl = asistencias.length;
      const presents = asistencias.filter((a: any) => a.presente).length;
      const expectedPercentage = totalAl > 0 ? Math.round((presents / totalAl) * 100) : 0;
      
      if (porcentajeAsistencia !== expectedPercentage) {
        throw new Error(`Calculation mismatch for student ${nombre} ${apellido}: got ${porcentajeAsistencia}%, expected ${expectedPercentage}%`);
      }
    });
    console.log('✅ Student percentage calculations match database state.');

    // 4. Test monthly filtering
    console.log('\nStep 5: Testing getResumenAsistencia with month filter...');
    // Find some class date in the DB to filter by
    const dateQuery = `
      SELECT DISTINCT fecha
      FROM asistencias
      WHERE id_division_x_unidad_curricular = ${divisionId}
      LIMIT 1
    `;
    const [dates] = await sequelize.query(dateQuery);
    if (dates.length > 0) {
      const sampleDate = (dates[0] as { fecha: string }).fecha;
      const sampleMonth = sampleDate.substring(0, 7); // YYYY-MM
      console.log(`Filtering by month: ${sampleMonth} (based on date: ${sampleDate})`);

      const resumenMensual = await asistenciaService.getResumenAsistencia(divisionId, sampleMonth);
      console.log('Mensual summary - resumenComision:', resumenMensual.resumenComision);
      
      // Verify monthly date filtering
      resumenMensual.alumnos.forEach((alumno: any) => {
        alumno.asistencias.forEach((asis: any) => {
          if (!asis.fecha.startsWith(sampleMonth)) {
            throw new Error(`Found attendance date ${asis.fecha} outside of requested month ${sampleMonth}!`);
          }
        });
      });
      console.log('✅ Monthly filtering successfully constrained dates.');

      // Verify general percentage math
      const cantidadAlumnos = resumenMensual.alumnos.length;
      const clasesDictadas = resumenMensual.resumenComision.totalClases;
      const totalPossibles = clasesDictadas * cantidadAlumnos;
      let totalPresents = 0;
      resumenMensual.alumnos.forEach((al: any) => {
        totalPresents += al.asistencias.filter((a: any) => a.presente).length;
      });
      const expectedGeneral = totalPossibles > 0 ? Math.round((totalPresents / totalPossibles) * 100) : 0;
      if (resumenMensual.resumenComision.porcentajeGeneral !== expectedGeneral) {
        throw new Error(`General percentage mismatch: got ${resumenMensual.resumenComision.porcentajeGeneral}%, expected ${expectedGeneral}%`);
      }
      console.log('✅ General percentage matches the formula.');
    } else {
      console.log('⚠️ No historical asistencias found for this division. Skipping month filter tests.');
    }

    console.log('\n🎉 ALL AUTOMATED TESTS COMPLETED SUCCESSFULLY! 🎉');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

run();
