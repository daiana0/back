import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface InformacionExtraAttributes extends InferAttributes<InformacionExtra> {
  id: number;
  titulo: string;
  icono: string | null;
  descripcion: string;
  idCarrera: number;
}
interface InformacionExtraCreationAttributes extends InferCreationAttributes<InformacionExtra> {
  titulo: string;
  icono: string | null;
  descripcion: string;
  idCarrera: number;
}

class InformacionExtra extends Model<InformacionExtraAttributes, InformacionExtraCreationAttributes> {
  declare id: CreationOptional<number>;
  declare titulo: string;
  declare icono: string | null;
  declare descripcion: string;
  declare idCarrera: number;
}


InformacionExtra.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    icono: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    idCarrera: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_carrera",
      references: { model: "carreras", key: "id" }
    }
  },
  {
    sequelize,
    tableName: "informacion_extra",
    timestamps: true
  }
);

export default InformacionExtra;