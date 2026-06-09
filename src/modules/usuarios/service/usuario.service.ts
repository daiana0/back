import Usuario from '../model/Usuario.js';
import type { CreateUsuarioDto } from '../dto/create-usuario.dto.js';
import type { UpdateUsuarioDto } from '../dto/update-usuario.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const usuarioService = {

  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await Usuario.findAndCountAll({
      limit,
      offset,
      order: [['id', 'ASC']],
      attributes: { exclude: ['contrasenia'] },
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


  async getByEmail(email: string) {
    return Usuario.findOne({
      where: { email },
      include: [
        {
          association: 'administrativo',
          include: ['rol'],
        },
      ],
    });
  },


  async getById(id: number) {
    return Usuario.findByPk(id, {
      attributes: { exclude: ['contrasenia'] },
    });
  },

  async create(data: CreateUsuarioDto) {
    // Usamos 'as any' porque Zod ya validó que 'data' tiene los campos necesarios.
    // TypeScript se queja por el 'id', pero Sequelize lo gestiona automáticamente.
    return Usuario.create(data as any);
  },

  async update(id: number, data: UpdateUsuarioDto) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;
    await usuario.update(data);
    return Usuario.findByPk(id, {
      attributes: { exclude: ['contrasenia'] },
    });
  },

  async delete(id: number) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return null;
    await usuario.destroy();
    return true;
  },
};