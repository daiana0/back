import InformacionExtra from '../model/InformacionExtra.js';
import type { CreateInformacionExtraDto } from '../dto/create-informacion-extra.dto.js';
import type { UpdateInformacionExtraDto } from '../dto/update-informacion-extra.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const informacionExtraService = {
    async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
        const offset = (page - 1) * limit;
        const { count, rows } = await InformacionExtra.findAndCountAll({
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
        return InformacionExtra.findByPk(id);
    },

    async create(data: CreateInformacionExtraDto) {
        return InformacionExtra.create(data as any);
    },

    async update(id: number, data: UpdateInformacionExtraDto) {
        const info = await InformacionExtra.findByPk(id);
        if (!info) return null;
        await info.update(data);
        return info.reload();
    },

    async delete(id: number) {
        const info = await InformacionExtra.findByPk(id);
        if (!info) return null;
        await info.destroy();
        return true;
    },
};