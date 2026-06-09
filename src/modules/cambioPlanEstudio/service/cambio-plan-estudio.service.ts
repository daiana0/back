import CambioPlanEstudio from '../model/CambioPlanEstudio.js';
import type { CreateCambioPlanEstudioDto } from '../dto/create-cambio-plan-estudio.dto.js';
import type { UpdateCambioPlanEstudioDto } from '../dto/update-cambio-plan-estudio.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const cambioPlanEstudioService = {
  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await CambioPlanEstudio.findAndCountAll({
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
    return CambioPlanEstudio.findByPk(id);
  },

  async create(data: CreateCambioPlanEstudioDto) {
    return CambioPlanEstudio.create(data as any);
  },

  async update(id: number, data: UpdateCambioPlanEstudioDto) {
    const entity = await CambioPlanEstudio.findByPk(id);
    if (!entity) return null;
    await entity.update(data as any);
    return entity.reload();
  },

  async delete(id: number) {
    const entity = await CambioPlanEstudio.findByPk(id);
    if (!entity) return null;
    await entity.destroy();
    return true;
  },
};