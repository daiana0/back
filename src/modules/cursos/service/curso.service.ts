import Curso from '../model/Curso.js';
import type { CreateCursoDto } from '../dto/create-curso.dto.js';
import type { UpdateCursoDto } from '../dto/update-curso.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const cursoService = {
  async getAll(page = DEFAULT_PAGE, limit = DEFAULT_LIMIT) {
    const offset = (page - 1) * limit;
    const { count, rows } = await Curso.findAndCountAll({
      limit, offset,
      order: [['anioAcademico', 'ASC']],
    });
    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  },
  async getById(id: number) {
    return Curso.findByPk(id);
  },
  async create(data: CreateCursoDto) {
    return Curso.create(data);
  },
  async update(id: number, data: UpdateCursoDto) {
    const curso = await Curso.findByPk(id);
    if (!curso) return null;
    await curso.update(data);
    return curso.reload();
  },
  async delete(id: number) {
    const curso = await Curso.findByPk(id);
    if (!curso) return null;
    await curso.destroy();
    return true;
  },
};