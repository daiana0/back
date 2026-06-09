import Division from '../model/Division.js';
import type { CreateDivisionDto } from '../dto/create-division.dto.js';
import type { UpdateDivisionDto } from '../dto/update-division.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const divisionService = {
  /**
   * Obtiene listado paginado de divisiones.
   * @param page Número de página (1-based).
   * @param limit Cantidad de registros por página (default 10).
   */
  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await Division.findAndCountAll({
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
    return Division.findByPk(id);
  },

  async create(data: CreateDivisionDto) {
    return Division.create(data);
  },

  async update(id: number, data: UpdateDivisionDto) {
    const division = await Division.findByPk(id);
    if (!division) return null;
    await division.update(data);
    return division;
  },

  async delete(id: number) {
    const division = await Division.findByPk(id);
    if (!division) return null;
    await division.destroy();
    return true;
  },
};
