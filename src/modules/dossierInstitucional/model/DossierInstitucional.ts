import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface DossierInstitucionalAttributes extends InferAttributes<DossierInstitucional> {
  id: number;
  idCarrera: number;
  titulo: string;
  seccion: string;
  contenido: string;
  urlArchivo: string | null;
  tipo: string;
  estado: boolean;
  fechaActualizacion: CreationOptional<Date>;
  idAdministrativo: number;
}

interface DossierInstitucionalCreationAttributes extends InferCreationAttributes<DossierInstitucional> {
  idCarrera: number;
  titulo: string;
  seccion: string;
  contenido: string;
  urlArchivo: string | null;
  tipo: string;
  estado: boolean;
  idAdministrativo: number;
}

class DossierInstitucional extends Model<DossierInstitucionalAttributes, DossierInstitucionalCreationAttributes> {
  declare id: CreationOptional<number>;
  declare idCarrera: number;
  declare titulo: string;
  declare seccion: string;
  declare contenido: string;
  declare urlArchivo: string | null;
  declare tipo: string;
  declare estado: boolean;
  declare fechaActualizacion: CreationOptional<Date>;
  declare idAdministrativo: number;
}

DossierInstitucional.init(
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
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    seccion: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    urlArchivo: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "url_archivo",
    },
    tipo: {
      type: DataTypes.ENUM("NORMATIVA", "INFORME", "CIRCULAR"),
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // false = borrador, true = publicado
    },
    fechaActualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "fecha_actualizacion",
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
    tableName: "dossiers_institucionales",
    timestamps: false,
  }
);

export default DossierInstitucional;