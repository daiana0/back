import LegajoXInstanciaEvaluativa from '../model/LegajoXInstanciaEvaluativa.js';
import type { CreateLegajoXInstanciaEvaluativaDto } from '../dto/create-legajo-x-instancia-evaluativa.dto.js';
import type { UpdateLegajoXInstanciaEvaluativaDto } from '../dto/update-legajo-x-instancia-evaluativa.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const legajoXInstanciaEvaluativaService = {

  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await LegajoXInstanciaEvaluativa.findAndCountAll({
      limit,
      offset,
      order: [['fechaRegistro', 'ASC']],
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
    return LegajoXInstanciaEvaluativa.findByPk(id);
  },

  // Historial académico: todas las notas de un legajo
  async getByLegajo(idLegajo: number) {
    return LegajoXInstanciaEvaluativa.findAll({
      where: { idLegajo },
      order: [['fechaRegistro', 'ASC']],
    });
  },

  // Todas las notas de una instancia evaluativa (ej: todas las notas de un parcial)
  async getByInstanciaEvaluativa(idInstanciaEvaluativa: number) {
    return LegajoXInstanciaEvaluativa.findAll({
      where: { idInstanciaEvaluativa },
      order: [['idLegajo', 'ASC']],
    });
  },

  async create(data: CreateLegajoXInstanciaEvaluativaDto) {
    return LegajoXInstanciaEvaluativa.create(data);
  },

  async update(id: number, data: UpdateLegajoXInstanciaEvaluativaDto) {
    const registro = await LegajoXInstanciaEvaluativa.findByPk(id);
    if (!registro) return null;
    await registro.update(data);
    return registro;
  },

  async delete(id: number) {
    const registro = await LegajoXInstanciaEvaluativa.findByPk(id);
    if (!registro) return null;
    await registro.destroy();
    return true;
  },
};
