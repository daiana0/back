import dotenv from 'dotenv';
dotenv.config();

import InstanciaEvaluativa from '../src/modules/instanciasEvaluativas/model/InstanciaEvaluativa.js';
import { DivisionXUnidadCurricular, UnidadCurricular } from '../src/modules/index.js';

async function run() {
  console.log('--- Consultando asignaciones disponibles en la base de datos ---');
  try {
    const list = await DivisionXUnidadCurricular.findAll({
      include: [{ model: UnidadCurricular, as: 'unidadCurricular' }]
    });

    console.log('Asignaciones encontradas:');
    list.forEach((item: any) => {
      console.log(`- ID DivisionXUnidadCurricular: ${item.id}, UC: ${item.unidadCurricular?.nombre || 'Desconocida'}`);
    });

    if (list.length === 0) {
      console.log('No se encontraron asignaciones.');
      process.exit(0);
    }

    // Busquemos las que correspondan a nuestra prueba
    // Por ejemplo, asumamos que id = 1 es la misma y id = 2 (u otra) es la otra.
    // Creemos una para la misma asignación (digamos item 1 o el id = 1) con tipo 'recuperatorio'
    const idAsigMisma = list[0].id;
    console.log(`\nCreando instancia 'recuperatorio' para la asignacion ID: ${idAsigMisma}...`);
    const inst1 = await InstanciaEvaluativa.create({
      idDivisionXUnidadCurricular: idAsigMisma,
      descripcion: 'Recuperatorio Primer Parcial',
      fecha: new Date(Date.now() + 24 * 60 * 60 * 1000 * 2), // 2 dias en el futuro
      tipo: 'recuperatorio',
      idAdministrativo: 1
    });
    console.log('✓ Creada con éxito:', inst1.toJSON());

    // Creemos una para otra asignación (digamos la tercera de la lista, o ID 3: Programación II)
    if (list.length > 2) {
      const idAsigOtra = list[2].id;
      console.log(`\nCreando instancia sin notas para otra asignacion ID: ${idAsigOtra} (Programación II)...`);
      const inst2 = await InstanciaEvaluativa.create({
        idDivisionXUnidadCurricular: idAsigOtra,
        descripcion: 'Trabajo Practico Integrador',
        fecha: new Date(Date.now() + 24 * 60 * 60 * 1000 * 5), // 5 dias en el futuro
        tipo: 'trabajo practico',
        idAdministrativo: 1
      });
      console.log('✓ Creada con éxito:', inst2.toJSON());
    } else {
      console.log('\nNo hay al menos 3 asignaciones en la base de datos para crear la instancia en Programación II.');
    }

  } catch (error) {
    console.error('Error durante la creación:', error);
  } finally {
    process.exit(0);
  }
}

run();
