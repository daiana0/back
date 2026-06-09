import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface DivisionAttributes extends InferAttributes<Division> {
  id: number;
  idDocente: number;
  idCurso: number;
  idAdministrativo: number;
}
interface DivisionCreationAttributes extends InferCreationAttributes<Division> {
  idDocente: number;
  idCurso: number;
  idAdministrativo: number;
}

class Division extends Model<DivisionAttributes, DivisionCreationAttributes> {
  declare id: CreationOptional<number>;
  declare idDocente: number;
  declare idCurso: number;
  declare idAdministrativo: number;
}

Division.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    idDocente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_docente",
      references: { model: "docentes", key: "id" }
    },
    idCurso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_curso",
      references: { model: "cursos", key: "id" }
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
    tableName: "divisiones",
    timestamps: true,
    // Opcional: índices para optimizar consultas
    // Evitan que la base de datos escanee toda la tabla cada vez que se consulte por esas claves.
    indexes: [
      { fields: ["id_docente"] },
      { fields: ["id_curso"] },
      { fields: ["id_administrativo"] }
    ]
  }
)

export default Division;