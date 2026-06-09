import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface TurnoExamenAttributes extends InferAttributes<TurnoExamen> {
    id: number;
    descripcion: string;
    fechaDesde: Date;
    fechaHasta: Date;
    idCicloLectivo: number;
    idAdministrativo: number;
}
interface TurnoExamenCreationAttributes extends InferCreationAttributes<TurnoExamen> {
    descripcion: string;
    fechaDesde: Date;
    fechaHasta: Date;
    idCicloLectivo: number;
    idAdministrativo: number;
}

class TurnoExamen extends Model<TurnoExamenAttributes, TurnoExamenCreationAttributes> {
    declare id: CreationOptional<number>;
    declare descripcion: string;
    declare fechaDesde: Date;
    declare fechaHasta: Date;
    declare idCicloLectivo: number;
    declare idAdministrativo: number;
}

TurnoExamen.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        descripcion: {
            type: DataTypes.STRING(100), allowNull: false,
            validate: { notEmpty: { msg: "La descripción es obligatoria" } }
        },
        fechaDesde: { type: DataTypes.DATEONLY, allowNull: false, field: "fecha_desde" },
        fechaHasta: { type: DataTypes.DATEONLY, allowNull: false, field: "fecha_hasta" },
        idCicloLectivo: {
            type: DataTypes.INTEGER, allowNull: false, field: "id_ciclo_lectivo",
            references: { model: "ciclos_lectivos", key: "id" }
        },
        idAdministrativo: {
            type: DataTypes.INTEGER, allowNull: false, field: "id_administrativo",
            references: { model: "administrativos", key: "id" }
        }
    },
    {
        sequelize,
        tableName: "turnos_examenes",
        timestamps: true,
        indexes: [
            { fields: ["id_ciclo_lectivo"] },
            { fields: ["id_administrativo"] }
        ]
    }
);

export default TurnoExamen;