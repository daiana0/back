import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '../../../config/database/conexion.js';

interface NotificacionAttributes extends InferAttributes<Notificacion> {
  id: number;
  idEstudiante: number | null;
  idDocente: number | null;
  idAdministrativo: number | null;
  titulo: string;
  mensaje: string;
  tipo: string;
  entidadRelacionada: string | null;
  entidadId: number | null;
  leida: boolean;
  fechaCreacion: Date;
}
interface NotificacionCreationAttributes extends InferCreationAttributes<Notificacion> {
  idEstudiante: number | null;
  idDocente: number | null;
  idAdministrativo: number | null;
  titulo: string;
  mensaje: string;
  tipo: string;
  entidadRelacionada: string | null;
  entidadId: number | null;
}
class Notificacion extends Model<NotificacionAttributes, NotificacionCreationAttributes> {
  declare id: CreationOptional<number>;
  declare idEstudiante: number | null;
  declare idDocente: number | null;
  declare idAdministrativo: number | null;
  declare titulo: string;
  declare mensaje: string;
  declare tipo: string;
  declare entidadRelacionada: string | null;
  declare entidadId: number | null;
  declare leida: CreationOptional<boolean>;
  declare fechaCreacion: CreationOptional<Date>;
}

Notificacion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idEstudiante: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "estudiantes", key: "id" },
    },
    idDocente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "docentes", key: "id" },
    },
    idAdministrativo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "administrativos", key: "id" },
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    entidadRelacionada: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    entidadId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    leida: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'notificaciones',
    timestamps: false,
  }
);

export default Notificacion;