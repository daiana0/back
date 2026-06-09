import { AppError } from '../../../core/middlewares/error-handler.middleware.js';
import { CreateEquivalenciaDto } from '../dto/create-equivalencia-unidad-curricular.dto.js';
import { UpdateEquivalenciaDto } from '../dto/update-equivalencia-unidad-curricular.dto.js';
import EquivalenciaUnidadCurricular from '../model/EquivalenciaUnidadCurricular.js';


const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const equivalenciaService = {
  getAll: async (page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) => {
    const offset = (page - 1) * limit;
    const { count, rows } = await EquivalenciaUnidadCurricular.findAndCountAll({
      offset,
      limit,
      order: [['id', 'ASC']],
    });
    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  getById: async (id: number) => {
    const eq = await EquivalenciaUnidadCurricular.findByPk(id);
    if (!eq) throw new AppError('Equivalencia no encontrada', 404);
    return eq;
  },

  create: async (data: CreateEquivalenciaDto) => {
    const nueva = await EquivalenciaUnidadCurricular.create(data as any);
    return nueva;
  },

  update: async (id: number, data: UpdateEquivalenciaDto) => {
    const eq = await EquivalenciaUnidadCurricular.findByPk(id);
    if (!eq) throw new AppError('Equivalencia no encontrada', 404);
    await eq.update(data);
    return eq;
  },

  delete: async (id: number) => {
    const eq = await EquivalenciaUnidadCurricular.findByPk(id);
    if (!eq) throw new AppError('Equivalencia no encontrada', 404);
    await eq.destroy();
    return true;
  },
};