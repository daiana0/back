import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface LegajoAttributes extends InferAttributes<Legajo> {
  id: number;
  idEstudiante: number;
  numeroLegajo: number;
  idPlanEstudio: number;
  activo: CreationOptional<boolean>;
  idAdministrativo: number;
}
interface LegajoCreationAttributes extends InferCreationAttributes<Legajo> {
  idEstudiante: number;
  numeroLegajo: number;
  idPlanEstudio: number;
  idAdministrativo: number;
}

class Legajo extends Model<LegajoAttributes, LegajoCreationAttributes> {
  declare id: CreationOptional<number>;
  declare idEstudiante: number;
  declare numeroLegajo: number;
  declare idPlanEstudio: number;
  declare activo: CreationOptional<boolean>;
  declare idAdministrativo: number;
}


Legajo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idEstudiante: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_estudiante",
      references: {
        model: "estudiantes",
        key: "id"
      }
    },
    numeroLegajo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idPlanEstudio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_plan_estudio",
      references: {
        model: "planes_estudios",
        key: "id"
      }
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    idAdministrativo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_administrativo",
      references: {
        model: "administrativos",
        key: "id"
      }
    }
  },
  {
    sequelize,
    tableName: "legajos",
    timestamps: true,
    // Opcional: índices para optimizar consultas
    indexes: [
      { fields: ["id_estudiante"] },
      { fields: ["id_plan_estudio"] },
      { fields: ["id_administrativo"] },
    ]
  }
)

export default Legajo;