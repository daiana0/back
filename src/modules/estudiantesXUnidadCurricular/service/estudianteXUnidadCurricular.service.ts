import EstudianteXUnidadCurricular from '../model/EstudianteXUnidadCurricular.js';
import type { CreateEstudianteXUnidadCurricularDto } from '../dto/create-estudianteXUnidadCurricular.dto.js';
import type { UpdateEstudianteXUnidadCurricularDto } from '../dto/update-estudianteXUnidadCurricular.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const estudianteXUnidadCurricularService = {
  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await EstudianteXUnidadCurricular.findAndCountAll({
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
    return EstudianteXUnidadCurricular.findByPk(id);
  },

  async create(data: CreateEstudianteXUnidadCurricularDto) {
    return EstudianteXUnidadCurricular.create(data as any);
  },

  async update(id: number, data: UpdateEstudianteXUnidadCurricularDto) {
    const record = await EstudianteXUnidadCurricular.findByPk(id);
    if (!record) return null;
    await record.update(data);
    return record;
  },

  async delete(id: number) {
    const record = await EstudianteXUnidadCurricular.findByPk(id);
    if (!record) return null;
    await record.destroy();
    return true;
  },
};
