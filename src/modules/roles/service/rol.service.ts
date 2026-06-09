import Rol from '../model/Rol.js';
import type { CreateRolDto } from '../dto/create-rol.dto.js';
import type { UpdateRolDto } from '../dto/update-rol.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const rolService = {

  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await Rol.findAndCountAll({
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
    return Rol.findByPk(id);
  },

  async create(data: CreateRolDto) {
    return Rol.create(data);
  },

  async update(id: number, data: UpdateRolDto) {
    const rol = await Rol.findByPk(id);
    if (!rol) return null;
    await rol.update(data);
    return rol.reload(); // recargar para tener los datos actualizados
  },

  async delete(id: number) {
    const rol = await Rol.findByPk(id);
    if (!rol) return null;
    await rol.destroy();
    return true;
  },
};