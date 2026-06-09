import DossierInstitucional from '../model/DossierInstitucional.js';
import type { CreateDossierInstitucionalDto } from '../dto/create-dossier-institucional.dto.js';
import type { UpdateDossierInstitucionalDto } from '../dto/update-dossier-institucional.dto.js';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const dossierInstitucionalService = {
    async getAll(page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
        const offset = (page - 1) * limit;
        const { count, rows } = await DossierInstitucional.findAndCountAll({
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
        return DossierInstitucional.findByPk(id);
    },

    async create(data: CreateDossierInstitucionalDto) {
        return DossierInstitucional.create(data as any);
    },

    async update(id: number, data: UpdateDossierInstitucionalDto) {
        const dossier = await DossierInstitucional.findByPk(id);
        if (!dossier) return null;
        await dossier.update(data);
        return dossier.reload();
    },

    async delete(id: number) {
        const dossier = await DossierInstitucional.findByPk(id);
        if (!dossier) return null;
        await dossier.destroy();
        return true;
    },
};