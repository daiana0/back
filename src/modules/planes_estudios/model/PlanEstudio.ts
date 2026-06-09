import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface PlanEstudioAttributes extends InferAttributes<PlanEstudio> {
  id: number;
  version: string;
  fechaDeAprobacion: string;
  fechaDeCierre: string;
  duracionEnAnios: number;
  estado: string | null;
  idCarrera: number;
  idAdministrativo: number;
}

interface PlanEstudioCreationAttributes extends InferCreationAttributes<PlanEstudio> {
  version: string;
  fechaDeAprobacion: string;
  fechaDeCierre: string;
  duracionEnAnios: number;
  estado: string | null;
  idCarrera: number;
  idAdministrativo: number;
}

class PlanEstudio extends Model<PlanEstudioAttributes, PlanEstudioCreationAttributes> {
  declare id: CreationOptional<number>;
  declare version: string;
  declare fechaDeAprobacion: string;
  declare fechaDeCierre: string;
  declare duracionEnAnios: number;
  declare estado: string | null;
  declare idCarrera: number;
  declare idAdministrativo: number;
}

PlanEstudio.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fechaDeAprobacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "fecha_de_aprobacion",
    },
    fechaDeCierre: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "fecha_de_cierre",
    },
    duracionEnAnios: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "duracion_en_anios",
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idCarrera: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_carrera",
      references: {
        model: "carreras",
        key: "id",
      },
    },
    idAdministrativo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_administrativo",
      references: {
        model: "administrativos",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "planes_estudios",
    timestamps: true,
    indexes: [
      { fields: ["id_carrera"] },
      { fields: ["id_administrativo"] },
    ],
  }
);

export default PlanEstudio;