import { Op } from "sequelize";
import PlanEstudio from "../model/PlanEstudio.js";
import type { CreatePlanEstudioDto } from "../dto/create-plan-estudio.dto.js";
import type { UpdatePlanEstudioDto } from "../dto/update-plan-estudio.dto.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

interface PlanEstudioFilters {
  idCarrera?: number;
  version?: string;
  estado?: string;
}

export const planEstudioService = {
  /**
   * Lista planes con paginación y filtros opcionales.
   */
  async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT, filters?: PlanEstudioFilters) {
    const offset = (page - 1) * limit;
    const where: any = {};

    if (filters?.idCarrera) {
      where.idCarrera = filters.idCarrera;
    }
    if (filters?.version) {
      where.version = { [Op.like]: `%${filters.version}%` };
    }
    if (filters?.estado) {
      where.estado = filters.estado;
    }

    const { count, rows } = await PlanEstudio.findAndCountAll({
      where,
      limit,
      offset,
      order: [["id", "ASC"]],
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
    return PlanEstudio.findByPk(id);
  },

  async create(data: CreatePlanEstudioDto) {
    return PlanEstudio.create(data);
  },

  async update(id: number, data: UpdatePlanEstudioDto) {
    const plan = await PlanEstudio.findByPk(id);
    if (!plan) return null;
    await plan.update(data);
    return plan.reload(); // recarga para obtener datos frescos
  },

  async delete(id: number) {
    const plan = await PlanEstudio.findByPk(id);
    if (!plan) return null;
    await plan.destroy();
    return true;
  },
};