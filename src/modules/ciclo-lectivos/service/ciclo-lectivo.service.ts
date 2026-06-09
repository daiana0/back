import CicloLectivo from '../model/CicloLectivo.js';
import type { CreateCicloLectivoDto } from '../dto/create-ciclo-lectivo.dto.js';
import type { UpdateCicloLectivoDto } from '../dto/update-ciclo-lectivo.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const cicloLectivoService = {
  async getAll(page = DEFAULT_PAGE, limit = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await CicloLectivo.findAndCountAll({
      limit,
      offset,
      order: [['anio', 'DESC']],
    });
    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  },

  async getById(id: number) {
    return CicloLectivo.findByPk(id);
  },

  async create(data: CreateCicloLectivoDto) {
    return CicloLectivo.create(data);
  },

  async update(id: number, data: UpdateCicloLectivoDto) {
    const ciclo = await CicloLectivo.findByPk(id);
    if (!ciclo) return null;
    await ciclo.update(data);
    return ciclo.reload();
  },

  async delete(id: number) {
    const ciclo = await CicloLectivo.findByPk(id);
    if (!ciclo) return null;
    await ciclo.destroy();
    return true;
  },
};