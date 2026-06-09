import Estudiante from '../model/Estudiante.js';
import type { CreateEstudianteDto } from '../dto/create-estudiante.dto.js';
import type { UpdateEstudianteDto } from '../dto/update-estudiante.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const estudianteService = {
    async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
        const offset = (page - 1) * limit;
        const { count, rows } = await Estudiante.findAndCountAll({
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
        return Estudiante.findByPk(id);
    },

    async create(data: CreateEstudianteDto) {
        return Estudiante.create(data as any);
    },

    async update(id: number, data: UpdateEstudianteDto) {
        const estudiante = await Estudiante.findByPk(id);
        if (!estudiante) return null;
        await estudiante.update(data as any);
        return estudiante.reload();
    },

    async delete(id: number) {
        const estudiante = await Estudiante.findByPk(id);
        if (!estudiante) return null;
        await estudiante.destroy();
        return true;
    },
};