import dotenv from 'dotenv';
dotenv.config();

import { docenteService } from '../src/modules/docentes/service/docente.service.js';
import sequelize from '../src/config/database/conexion.js';

async function run() {
  try {
    console.log('--- STARTING ACADEMIC PANEL AUTOMATED TESTS ---');

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

    // 3. Test getPanelAcademico for valid assignment
    console.log('\nStep 3: Testing getPanelAcademico for valid assignment...');
    const panelData = await docenteService.getPanelAcademico(divisionId);
    
    if (!panelData) {
      throw new Error('getPanelAcademico returned null for a valid assignment!');
    }

    console.log('Panel data keys:', Object.keys(panelData));
    console.log('Asignacion details:', panelData.asignacion);
    console.log('Estadisticas details:', panelData.estadisticas);
    console.log(`Number of evaluations: ${panelData.evaluaciones.length}`);
    console.log(`Number of students: ${panelData.alumnos.length}`);

    // Validate structure of statistics
    const stats = panelData.estadisticas;
    const expectedStatsKeys = [
      'totalAlumnos',
      'totalEvaluaciones',
      'totalClases',
      'promocionados',
      'regulares',
      'libres',
      'porcentajePromocionados',
      'porcentajeRegulares',
      'porcentajeLibres',
      'porcentajeAsistenciaGeneral'
    ];
    for (const key of expectedStatsKeys) {
      if (!(key in stats)) {
        throw new Error(`Missing expected statistic key: ${key}`);
      }
    }
    console.log('✅ Estadisticas structure is correct.');

    // Validate students mapping
    if (panelData.alumnos.length > 0) {
      const student = panelData.alumnos[0];
      const expectedStudentKeys = [
        'idLegajo',
        'dni',
        'apellido',
        'nombre',
        'condicion',
        'porcentajeAsistencia',
        'asistenciaInsuficiente',
        'notas'
      ];
      for (const key of expectedStudentKeys) {
        if (!(key in student)) {
          throw new Error(`Missing expected student property: ${key}`);
        }
      }
      console.log('✅ Students structure is correct.');

      // Check order of students (apellido ASC, nombre ASC)
      let prevApellido = '';
      let prevNombre = '';
      panelData.alumnos.forEach((al: any) => {
        const fullName = `${al.apellido}, ${al.nombre}`;
        const prevFullName = `${prevApellido}, ${prevNombre}`;
        if (prevFullName.localeCompare(fullName) > 0) {
          throw new Error(`Students are not sorted by apellido/nombre ASC! Found ${prevFullName} before ${fullName}`);
        }
        prevApellido = al.apellido;
        prevNombre = al.nombre;
      });
      console.log('✅ Students are correctly sorted by apellido, nombre ASC.');
    }

    // 4. Test getPanelAcademico for non-existing assignment (should return null)
    console.log('\nStep 4: Testing getPanelAcademico for non-existing assignment...');
    const nullPanel = await docenteService.getPanelAcademico(99999);
    console.log(`Result of non-existing assignment (expected: null): ${nullPanel}`);
    if (nullPanel !== null) {
      throw new Error('getPanelAcademico did not return null for a non-existing assignment!');
    }
    console.log('✅ Non-existing assignment returns null correctly.');

    console.log('\n🎉 ALL AUTOMATED TESTS COMPLETED SUCCESSFULLY! 🎉');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

run();
