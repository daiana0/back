// 1.34 Asistencia
import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface AsistenciaAttributes extends InferAttributes<Asistencia> {
    id: number;
    idDivisionXUnidadCurricular: number;
    fecha: Date;
    presente: boolean;
    idLegajo: number;
    idAdministrativo: number;
}

interface AsistenciaCreationAttributes extends InferCreationAttributes<Asistencia> {
    id: CreationOptional<number>;
    idDivisionXUnidadCurricular: number;
    fecha: Date;
    presente: boolean;
    idLegajo: number;
    idAdministrativo: number;
}

class Asistencia extends Model<AsistenciaAttributes, AsistenciaCreationAttributes> {
    declare id: CreationOptional<number>;
    declare idDivisionXUnidadCurricular: number;
    declare fecha: Date;
    declare presente: boolean;
    declare idLegajo: number;
    declare idAdministrativo: number;
}

Asistencia.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        idDivisionXUnidadCurricular: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "id_division_x_unidad_curricular",
            references: { model: "divisiones_x_unidades_curriculares", key: "id" }
        },
        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        presente: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        idLegajo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "id_legajo",
            references: { model: "legajos", key: "id" }
        },
        idAdministrativo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "id_administrativo",
            references: { model: "administrativos", key: "id" }
        },
    },
    {
        sequelize,
        tableName: "asistencias",
        timestamps: true,
        // Opcional: índice único para evitar doble asistencia misma fecha/alumno/comisión
        indexes: [{
            unique: true, fields: ["id_division_x_unidad_curricular", "fecha", "id_legajo"],
            name: "un_asistencia_alumno_div_fecha"
        }],
    }
);

export default Asistencia;