import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface CicloLectivoAttributes extends InferAttributes<CicloLectivo> {
    id: number;
    anio: number;
    activo: boolean;
    fechaInicio: string;
    fechaFin: string;
    idPlanEstudio: number;
    idAdministrativo: number;
}

interface CicloLectivoCreationAttributes extends InferCreationAttributes<CicloLectivo> {
    anio: number;
    activo: CreationOptional<boolean>;
    fechaInicio: string;
    fechaFin: string;
    idPlanEstudio: number;
    idAdministrativo: number;
}

class CicloLectivo extends Model<CicloLectivoAttributes, CicloLectivoCreationAttributes> {
    declare id: CreationOptional<number>;
    declare anio: number;
    declare activo: CreationOptional<boolean>;
    declare fechaInicio: string;
    declare fechaFin: string;
    declare idPlanEstudio: number;
    declare idAdministrativo: number;
}

CicloLectivo.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        anio: { type: DataTypes.INTEGER, allowNull: false },
        activo: { type: DataTypes.BOOLEAN, defaultValue: true },
        fechaInicio: { type: DataTypes.DATEONLY, allowNull: false },
        fechaFin: { type: DataTypes.DATEONLY, allowNull: false },
        idPlanEstudio: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "id_plan_estudio",
            references: { model: "planes_estudios", key: "id" }
        },
        idAdministrativo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "id_administrativo",
            references: { model: "administrativos", key: "id" }
        }
    },
    {
        sequelize,
        tableName: "ciclos_lectivos",
        timestamps: true,
        indexes: [{ unique: true, fields: ["anio"] }]
    }
);

export default CicloLectivo;