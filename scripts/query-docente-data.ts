import dotenv from 'dotenv';
dotenv.config();

import { DivisionXUnidadCurricular, UnidadCurricular, InstanciaEvaluativa } from '../src/modules/index.js';
import sequelize from '../src/config/database/conexion.js';

async function run() {
  try {
    // Buscar asignaciones docentes
    const query = `
      SELECT dd.id, dd.id_docente, dd.id_division_x_unidad_curricular, duc.id_division, duc.id_unidad_curricular, uc.nombre
      FROM designaciones_docentes dd
      JOIN divisiones_x_unidades_curriculares duc ON dd.id_division_x_unidad_curricular = duc.id
      JOIN unidades_curriculares uc ON duc.id_unidad_curricular = uc.id
    `;
    const [asignaciones] = await sequelize.query(query);
    console.log('--- Asignaciones de docentes registradas en BD ---');
    console.log(asignaciones);

    console.log('\n--- Instancias Evaluativas registradas en BD ---');
    const instancias = await InstanciaEvaluativa.findAll({
      include: [{
        model: DivisionXUnidadCurricular,
        as: 'divisionXUnidadCurricular',
        include: [{ model: UnidadCurricular, as: 'unidadCurricular' }]
      }]
    });
    instancias.forEach((inst: any) => {
      console.log(`- ID: ${inst.id}, Desc: ${inst.descripcion}, Tipo: ${inst.tipo}, idDivisionXUnidadCurricular: ${inst.idDivisionXUnidadCurricular} (UC: ${inst.divisionXUnidadCurricular?.unidadCurricular?.nombre})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

run();
