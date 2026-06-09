import DivisionXUnidadCurricular from '../model/DivisionXUnidadCurricular.js';
import type { CreateDivisionXUnidadCurricularDto } from '../dto/create-divisionXUnidadCurricular.dto.js';
import type { UpdateDivisionXUnidadCurricularDto } from '../dto/update-divisionXUnidadCurricular.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const divisionXUnidadCurricularService = {
  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await DivisionXUnidadCurricular.findAndCountAll({
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
    return DivisionXUnidadCurricular.findByPk(id);
  },

  async create(data: CreateDivisionXUnidadCurricularDto) {
    return DivisionXUnidadCurricular.create(data);
  },

  async update(id: number, data: UpdateDivisionXUnidadCurricularDto) {
    const registro = await DivisionXUnidadCurricular.findByPk(id);
    if (!registro) return null;
    await registro.update(data);
    return registro;
  },

  async delete(id: number) {
    const registro = await DivisionXUnidadCurricular.findByPk(id);
    if (!registro) return null;
    await registro.destroy();
    return true;
  },
};
