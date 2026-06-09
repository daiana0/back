import Preinscripto from '../model/Preinscripto.js';
import type { CreatePreinscriptoDto } from '../dto/create-preinscripto.dto.js';
import type { UpdatePreinscriptoDto } from '../dto/update-preinscripto.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const preinscriptoService = {
  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await Preinscripto.findAndCountAll({
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
    return Preinscripto.findByPk(id);
  },

  // async create(data: CreatePreinscriptoDto) {
  //   return Preinscripto.create(data as any);
  // },
  async create(data: CreatePreinscriptoDto) {
    const existente = await this.findByUsuarioAndCarrera(data.idUsuario, data.idCarrera);
    if (existente) {
      const err = new Error('Ya existe una preinscripción para esta carrera');
      (err as any).statusCode = 409;
      throw err;
    }
    return Preinscripto.create(data as any);
  },

  async update(id: number, data: UpdatePreinscriptoDto) {
    const pre = await Preinscripto.findByPk(id);
    if (!pre) return null;
    await pre.update(data);
    return pre.reload();
  },

  async delete(id: number) {
    const pre = await Preinscripto.findByPk(id);
    if (!pre) return null;
    await pre.destroy();
    return true;
  },
  async getByUsuario(idUsuario: number) {
    return Preinscripto.findAll({
      where: { idUsuario },
      order: [['fechaInscripcion', 'DESC']],
    });
  },

  async findByUsuarioAndCarrera(idUsuario: number, idCarrera: number) {
    return Preinscripto.findOne({ where: { idUsuario, idCarrera } });
  },
};