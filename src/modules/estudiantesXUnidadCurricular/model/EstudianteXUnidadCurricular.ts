import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface EstudianteXUnidadCurricularAttributes extends InferAttributes<EstudianteXUnidadCurricular> {
    id: number;
    idDivisionXUnidadCurricular: number;
    idLegajo: number;
    fechaDeInscripcion: string;
    condicion: "promocionado" | "regular" | "libre";
    idAdministrativo: number;
}

interface EstudianteXUnidadCurricularCreationAttributes extends InferCreationAttributes<EstudianteXUnidadCurricular> {
    id: CreationOptional<number>;
    idDivisionXUnidadCurricular: number;
    idLegajo: number;
    fechaDeInscripcion: string;
    condicion: "promocionado" | "regular" | "libre"
    idAdministrativo: number;
}

class EstudianteXUnidadCurricular extends Model<EstudianteXUnidadCurricularAttributes, EstudianteXUnidadCurricularCreationAttributes> {
    declare id: CreationOptional<number>;
    declare idDivisionXUnidadCurricular: number;
    declare idLegajo: number;
    declare fechaDeInscripcion: string;
    declare condicion: "promocionado" | "regular" | "libre";
    declare idAdministrativo: number;
}

EstudianteXUnidadCurricular.init(
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
        idLegajo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "id_legajo",
            references: { model: "legajos", key: "id" }
        },
        fechaDeInscripcion: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            field: "fecha_de_inscripcion"
        },
        condicion: {
            type: DataTypes.ENUM("promocionado", "regular", "libre"),
            allowNull: false
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
        tableName: "estudiantes_x_unidades_curriculares",
        timestamps: true,
    }
);

export default EstudianteXUnidadCurricular;