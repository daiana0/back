import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../../../config/database/conexion.js";

interface CambioPlanEstudioAttributes extends InferAttributes<CambioPlanEstudio> {
  id: number;
  idLegajo: number;
  idPlanEstudioOrigen: number;
  idPlanEstudioDestino: number;
  idUsuarioGestor: number;
  fechaSolicitud: Date;
  fechaAprobacion: Date | null;
  plazoVencimiento: Date | null;
  estado: string;
  observaciones: string | null;
  idAdministrativo: number;
}

interface CambioPlanEstudioCreationAttributes extends InferCreationAttributes<CambioPlanEstudio> {
  idLegajo: number;
  idPlanEstudioOrigen: number;
  idPlanEstudioDestino: number;
  idUsuarioGestor: number | null;
  fechaAprobacion: Date | null;
  plazoVencimiento: Date | null;
  estado: string;
  observaciones: string | null;
  idAdministrativo: number;
}

class CambioPlanEstudio extends Model<CambioPlanEstudioAttributes, CambioPlanEstudioCreationAttributes> {
  declare id: CreationOptional<number>;
  declare idLegajo: number;
  declare idPlanEstudioOrigen: number;
  declare idPlanEstudioDestino: number;
  declare idUsuarioGestor: number | null;
  declare fechaSolicitud: CreationOptional<Date>;
  declare fechaAprobacion: Date | null;
  declare plazoVencimiento: Date | null;
  declare estado: string;
  declare observaciones: string | null;
  declare idAdministrativo: number;
}

CambioPlanEstudio.init(
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
    idPlanEstudioOrigen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_plan_estudio_origen",
      references: { model: "planes_estudios", key: "id" },
    },
    idPlanEstudioDestino: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "id_plan_estudio_destino",
      references: { model: "planes_estudios", key: "id" },
    },
    idUsuarioGestor: {
      type: DataTypes.INTEGER,
      allowNull: true,// puede ser null hasta que un admin/docente lo gestione
      field: "id_usuario_gestor",
      //references: { model: "usuarios", key: "id" }, // puede ser admin o docente
    },
    fechaSolicitud: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "fecha_solicitud",
    },
    fechaAprobacion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "fecha_aprobacion",
    },
    plazoVencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "plazo_vencimiento",
    },
    estado: {
      type: DataTypes.ENUM("PENDIENTE", "APROBADO", "RECHAZADO"),
      defaultValue: "PENDIENTE",
    },
    observaciones: {
      type: DataTypes.TEXT,
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
    tableName: "cambios_planes_estudios",
    timestamps: true,
  }
);

export default CambioPlanEstudio;