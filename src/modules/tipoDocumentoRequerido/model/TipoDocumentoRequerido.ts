import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface TipoDocumentoRequeridoAttributes
  extends InferAttributes<TipoDocumentoRequerido> {
  id: number;
  idCarrera: number;
  nombreDocumento: string;
  obligatorio: boolean;
  esCritico: boolean;
  descripcion: string | null;
  diasVigencia: number | null;
  idAdministrativo: number;
}

interface TipoDocumentoRequeridoCreationAttributes
  extends InferCreationAttributes<TipoDocumentoRequerido> {
  idCarrera: number;
  nombreDocumento: string;
  descripcion: string | null;
  diasVigencia: number | null;
  idAdministrativo: number;
}

class TipoDocumentoRequerido
  extends Model<
    TipoDocumentoRequeridoAttributes,
    TipoDocumentoRequeridoCreationAttributes
  > {
  declare id: CreationOptional<number>;
  declare idCarrera: number;
  declare nombreDocumento: string;
  declare obligatorio: CreationOptional<boolean>;
  declare esCritico: CreationOptional<boolean>;
  declare descripcion: string | null;
  declare diasVigencia: number | null;
  declare idAdministrativo: number;
}

TipoDocumentoRequerido.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idCarrera: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_carrera",
      references: { model: "carreras", key: "id" },
    },
    nombreDocumento: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "nombre_documento",
      validate: {
        notEmpty: { msg: "El nombre del documento es obligatorio" },
      },
    },
    obligatorio: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    esCritico: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "es_critico",
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    diasVigencia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "dias_vigencia",
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
    tableName: "tipos_documentos_requeridos",
    timestamps: true,
    indexes: [
      { fields: ["id_carrera"] },
      { fields: ["nombre_documento"] },
      { fields: ["id_administrativo"] },
    ],
  }
);

export default TipoDocumentoRequerido;
