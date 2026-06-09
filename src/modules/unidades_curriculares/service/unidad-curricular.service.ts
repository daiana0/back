import { Op } from "sequelize";
import UnidadCurricular from "../model/UnidadCurricular.js";
import type { CreateUnidadCurricularDto } from "../dto/create-unidad-curricular.dto.js";
import type { UpdateUnidadCurricularDto } from "../dto/update-unidad-curricular.dto.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

interface UnidadCurricularFilters {
  idPlanEstudio?: number;
  nombre?: string;
  duracion?: "anual" | "cuatrimestral";
}

export const unidadCurricularService = {
  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT, filters?: UnidadCurricularFilters) {
    const offset = (page - 1) * limit;
    const where: any = {};

    if (filters?.idPlanEstudio) where.idPlanEstudio = filters.idPlanEstudio;
    if (filters?.nombre) where.nombre = { [Op.like]: `%${filters.nombre}%` };
    if (filters?.duracion) where.duracion = filters.duracion;

    const { count, rows } = await UnidadCurricular.findAndCountAll({
      where,
      limit,
      offset,
      order: [["id", "ASC"]],
    });

    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  },

  async getById(id: number) {
    return UnidadCurricular.findByPk(id);
  },

  async create(data: CreateUnidadCurricularDto) {
    return UnidadCurricular.create(data);
  },

  async update(id: number, data: UpdateUnidadCurricularDto) {
    const uc = await UnidadCurricular.findByPk(id);
    if (!uc) return null;
    await uc.update(data);
    return uc.reload();
  },

  async delete(id: number) {
    const uc = await UnidadCurricular.findByPk(id);
    if (!uc) return null;
    await uc.destroy();
    return true;
  },
};