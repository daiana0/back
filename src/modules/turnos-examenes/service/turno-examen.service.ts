import TurnoExamen from '../model/TurnoExamen.js';
import type { CreateTurnoExamenDto } from '../dto/create-turno-examen.dto.js';
import type { UpdateTurnoExamenDto } from '../dto/update-turno-examen.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const turnoExamenService = {
  async getAll(page = DEFAULT_PAGE, limit = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await TurnoExamen.findAndCountAll({
      limit, offset,
      order: [['fechaDesde', 'DESC']],
    });
    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  },
  async getById(id: number) {
    return TurnoExamen.findByPk(id);
  },
  async create(data: CreateTurnoExamenDto) {
    return TurnoExamen.create(data);
  },
  async update(id: number, data: UpdateTurnoExamenDto) {
    const turno = await TurnoExamen.findByPk(id);
    if (!turno) return null;
    await turno.update(data);
    return turno.reload();
  },
  async delete(id: number) {
    const turno = await TurnoExamen.findByPk(id);
    if (!turno) return null;
    await turno.destroy();
    return true;
  },
};