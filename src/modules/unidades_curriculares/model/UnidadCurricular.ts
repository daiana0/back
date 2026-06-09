import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface UnidadCurricularAttributes extends InferAttributes<UnidadCurricular> {
  id: number;
  idPlanEstudio: number;
  nombre: string;
  duracion: "anual" | "cuatrimestral";
  cargaHoraria: number;
  cuatrimestre: "primero" | "segundo" | null;
  idAdministrativo: number;
}

interface UnidadCurricularCreationAttributes extends InferCreationAttributes<UnidadCurricular> {
  idPlanEstudio: number;
  nombre: string;
  duracion: "anual" | "cuatrimestral";
  cargaHoraria: number;
  cuatrimestre: "primero" | "segundo" | null;
  idAdministrativo: number;
}

class UnidadCurricular extends Model<UnidadCurricularAttributes, UnidadCurricularCreationAttributes> {
  declare id: CreationOptional<number>;
  declare idPlanEstudio: number;
  declare nombre: string;
  declare duracion: "anual" | "cuatrimestral";
  declare cargaHoraria: number;
  declare cuatrimestre: "primero" | "segundo" | null;
  declare idAdministrativo: number;
}

UnidadCurricular.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idPlanEstudio: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_plan_estudio",
      references: { model: "planes_estudios", key: "id" },
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: { msg: "El nombre es obligatorio" } },
    },
    duracion: {
      type: DataTypes.ENUM("anual", "cuatrimestral"),
      allowNull: false,
    },
    cargaHoraria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cuatrimestre: {
      type: DataTypes.ENUM("primero", "segundo"),
      allowNull: true,
    },
    idAdministrativo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_administrativo",
      references: { model: "administrativos", key: "id" },
    },
  },
  {
    sequelize,
    tableName: "unidades_curriculares",
    timestamps: true,
    indexes: [
      { fields: ["id_plan_estudio"] },
      { fields: ["nombre"] },
      { fields: ["id_administrativo"] },
    ],
  }
);

export default UnidadCurricular;