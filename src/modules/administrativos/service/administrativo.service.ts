import Administrativo from '../model/Administrativo.js';
import type { CreateAdministrativoDto } from '../dto/create-administrativo.dto.js';
import type { UpdateAdministrativoDto } from '../dto/update-administrativo.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const administrativoService = {

  /**
   * Obtiene listado paginado de administrativos.
   * @param page Número de página (1-based).
   * @param limit Cantidad de registros por página (default 10).
   */
  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await Administrativo.findAndCountAll({
      where: { idRol: [1, 4] }, // solo administrativos (idRol 1 o 4),
      limit,
      offset,
      order: [['id', 'ASC']],
      attributes: { exclude: ['contrasenia'] }, // nunca devolver la contraseña
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
    return Administrativo.findByPk(id, {
      attributes: { exclude: ['contrasenia'] },
    });
  },

  async create(data: CreateAdministrativoDto) {
    // El hook `beforeCreate` del modelo se encargará de hashear la contraseña
    return Administrativo.create(data as any);
  },

  async update(id: number, data: UpdateAdministrativoDto) {
    const admin = await Administrativo.findByPk(id);
    if (!admin) return null;
    await admin.update(data);
    // Recargar para devolver datos limpios (sin contrasenia)
    return administrativoService.getById(id);
  },

  async delete(id: number) {
    const admin = await Administrativo.findByPk(id);
    if (!admin) return null;
    await admin.destroy();
    return true;
  },
};