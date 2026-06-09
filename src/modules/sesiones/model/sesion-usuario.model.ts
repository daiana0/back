import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../../../config/database/conexion.js';

interface SesionUsuarioAttributes extends InferAttributes<SesionUsuario> {
  id: CreationOptional<number>;
  idUsuario: number | null;
  fechaInicioSesion: CreationOptional<Date>;
  fechaCierreSesion: Date | null;
  intentoFallido: CreationOptional<number>;
  bloqueado: CreationOptional<boolean>;
  idAdministrativo: number | null;
  idDocente: number | null;
}

interface SesionUsuarioCreationAttributes extends InferCreationAttributes<SesionUsuario> {
  idUsuario: number | null;
  fechaCierreSesion: Date | null;
  intentoFallido: CreationOptional<number>;
  bloqueado: CreationOptional<boolean>;
  idAdministrativo: number | null;
  idDocente: number | null;
}

class SesionUsuario extends Model<SesionUsuarioAttributes, SesionUsuarioCreationAttributes> {
  declare id: CreationOptional<number>;
  declare idUsuario: number | null;
  declare fechaInicioSesion: CreationOptional<Date>;
  declare fechaCierreSesion: Date | null;
  declare intentoFallido: CreationOptional<number>;
  declare bloqueado: CreationOptional<boolean>;
  declare idAdministrativo: number | null;
  declare idDocente: number | null;
}

SesionUsuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idUsuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'id_usuario',
      references: { model: 'usuarios', key: 'id' },
    },
    fechaInicioSesion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fechaCierreSesion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    intentoFallido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    bloqueado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: 'sesiones_usuarios',
    timestamps: false,
  }
);

export default SesionUsuario;