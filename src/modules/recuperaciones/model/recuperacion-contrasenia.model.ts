import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../../../config/database/conexion.js';

interface RecuperacionContraseniaAttributes extends InferAttributes<RecuperacionContrasenia> {
  id: CreationOptional<number>;
  tokenHash: string;
  idUsuario: number | null;
  fechaExpiracion: Date;
  usado: CreationOptional<boolean>;
  fechaUso: Date | null;
  idAdministrativo: number | null;
  idDocente: number | null;
}
interface RecuperacionContraseniaCreationAttributes extends InferCreationAttributes<RecuperacionContrasenia> {
  tokenHash: string;
  idUsuario: number | null;
  fechaExpiracion: Date;
  fechaUso: Date | null;
  idAdministrativo: number | null;
  idDocente: number | null;
}

class RecuperacionContrasenia extends Model<RecuperacionContraseniaAttributes, RecuperacionContraseniaCreationAttributes> {
  declare id: CreationOptional<number>;
  declare tokenHash: string;
  declare idUsuario: number | null;
  declare fechaExpiracion: Date;
  declare usado: CreationOptional<boolean>;
  declare fechaUso: Date | null;
  declare idAdministrativo: number | null;
  declare idDocente: number | null;
}

RecuperacionContrasenia.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tokenHash: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
      field: 'token_hash',
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'id_usuario',
      references: { model: 'usuarios', key: 'id' },
    },
    fechaExpiracion: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    usado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    fechaUso: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    idAdministrativo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'id_administrativo',
      references: { model: 'administrativos', key: 'id' },
    },
    idDocente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'id_docente',
      references: { model: 'docentes', key: 'id' },
    },
  },
  {
    sequelize,
    tableName: 'recuperaciones_contrasenia',
    timestamps: false,
  }
);

export default RecuperacionContrasenia;
