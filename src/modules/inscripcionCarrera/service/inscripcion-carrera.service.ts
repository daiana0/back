import InscripcionCarrera from '../model/InscripcionCarrera.js';
import type { CreateInscripcionCarreraDto } from '../dto/create-inscripcion-carrera.dto.js';
import type { UpdateInscripcionCarreraDto } from '../dto/update-inscripcion-carrera.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const inscripcionCarreraService = {
    async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
        const offset = (page - 1) * limit;
        const { count, rows } = await InscripcionCarrera.findAndCountAll({
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
        return InscripcionCarrera.findByPk(id);
    },

    async create(data: CreateInscripcionCarreraDto) {
        return InscripcionCarrera.create(data as any);
    },

    async update(id: number, data: UpdateInscripcionCarreraDto) {
        const inscripcion = await InscripcionCarrera.findByPk(id);
        if (!inscripcion) return null;
        await inscripcion.update(data);
        return inscripcion.reload();
    },

    async delete(id: number) {
        const inscripcion = await InscripcionCarrera.findByPk(id);
        if (!inscripcion) return null;
        await inscripcion.destroy();
        return true;
    },
};