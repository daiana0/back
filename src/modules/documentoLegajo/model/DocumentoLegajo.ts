import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface DocumentoLegajoAttributes extends InferAttributes<DocumentoLegajo> {
  id: number;
  idLegajo: number;
  idTipoDocumentoRequerido: number;
  idUsuarioCarga: number;
  urlArchivo: string;
  fechaCarga: Date;
  fechaVencimiento: Date | null;
  estado: "APROBADO" | "RECHAZADO" | "PENDIENTE";
  idAdministrativo: number;
}

interface DocumentoLegajoCreationAttributes extends InferCreationAttributes<DocumentoLegajo> {
  idLegajo: number;
  idTipoDocumentoRequerido: number;
  idUsuarioCarga: number;
  urlArchivo: string;
  fechaVencimiento: Date | null;
  idAdministrativo: number;
}

class DocumentoLegajo extends Model<DocumentoLegajoAttributes, DocumentoLegajoCreationAttributes> {
  declare id: CreationOptional<number>;
  declare idLegajo: number;
  declare idTipoDocumentoRequerido: number;
  declare idUsuarioCarga: number;
  declare urlArchivo: string;
  declare fechaCarga: CreationOptional<Date>;
  declare fechaVencimiento: Date | null;
  declare estado: CreationOptional<"APROBADO" | "RECHAZADO" | "PENDIENTE">;
  declare idAdministrativo: number;
}

DocumentoLegajo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idLegajo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_legajo",
      references: { model: "legajos", key: "id" },
    },
    idTipoDocumentoRequerido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_tipo_documento_requerido",
      references: { model: "tipos_documentos_requeridos", key: "id" },
    },
    idUsuarioCarga: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_usuario_carga",
      references: { model: "usuarios", key: "id" },
    },
    urlArchivo: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: "url_archivo",
    },
    fechaCarga: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "fecha_carga",
    },
    fechaVencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "fecha_vencimiento",
    },
    estado: {
      type: DataTypes.ENUM("APROBADO", "RECHAZADO", "PENDIENTE"),
      defaultValue: "PENDIENTE",
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
    tableName: "documentos_legajos",
    timestamps: false, // Coherente con el modelo (fechaCarga explícita)
  }
);

export default DocumentoLegajo;
