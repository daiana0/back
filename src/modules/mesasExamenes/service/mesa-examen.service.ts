import MesaExamen from '../model/MesaExamen.js';
import type { CreateMesaExamenDto } from '../dto/create-mesa-examen.dto.js';
import type { UpdateMesaExamenDto } from '../dto/update-mesa-examen.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const mesaExamenService = {

  /**
   * Obtiene listado paginado de mesas de examen.
   */
  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await MesaExamen.findAndCountAll({
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
    return MesaExamen.findByPk(id);
  },

  async create(data: CreateMesaExamenDto) {
    return MesaExamen.create(data as any);
  },

  async update(id: number, data: UpdateMesaExamenDto) {
    const mesa = await MesaExamen.findByPk(id);
    if (!mesa) return null;

    // Actualizamos con los datos que vengan en el DTO parcial
    await mesa.update(data as any);
    return mesa;
  },

  async delete(id: number) {
    const mesa = await MesaExamen.findByPk(id);
    if (!mesa) return null;

    await mesa.destroy();
    return true;
  },
};