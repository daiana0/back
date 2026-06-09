import { AppError } from "../../../core/middlewares/error-handler.middleware.js";
import { CreateNotificacionXEmailDto } from "../dto/create-notificacionXEmail.dto.js";
import { UpdateNotificacionXEmailDto } from "../dto/update-notificacionXEmail.dto.js";
import NotificacionXEmail from "../model/notificacionXEmail.model.js";
import sendEmail from "./nodemailer.service.js";


const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const notificacionService = {
  getAll: async (page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) => {
    const offset = (page - 1) * limit;
    const { count, rows } = await NotificacionXEmail.findAndCountAll({
      offset,
      limit,
      order: [['fechaCreacion', 'DESC']],
    });
    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  },

  getById: async (id: number) => {
    const notificacion = await NotificacionXEmail.findByPk(id);
    if (!notificacion) throw new AppError('Notificación no encontrada', 404);
    return notificacion;
  },

  create: async (data: CreateNotificacionXEmailDto) => {
    // Los campos con defaultValue (leida, fechaCreacion) se asignan automáticamente
    const nueva = await NotificacionXEmail.create(data as any);
    return nueva;
  },

  update: async (id: number, data: UpdateNotificacionXEmailDto) => {
    const notificacion = await NotificacionXEmail.findByPk(id);
    if (!notificacion) throw new AppError('Notificación no encontrada', 404);
    await notificacion.update(data);
    return notificacion;
  },

  delete: async (id: number) => {
    const notificacion = await NotificacionXEmail.findByPk(id);
    if (!notificacion) throw new AppError('Notificación no encontrada', 404);
    await notificacion.destroy();
    return true;
  },
  envioEmail: async (prioridad: 'alta' | 'media' | 'baja') => {
    // Buscar todas las no enviadas con esa prioridad
    const notificaciones = await NotificacionXEmail.findAll({
      where: {
        enviado: false,
        prioridad,
      },
    });

    if (notificaciones.length === 0) {
      console.log(`No hay notificaciones pendientes con prioridad ${prioridad}`);
      return;
    }

    console.log(`Enviando ${notificaciones.length} notificaciones de prioridad ${prioridad}...`);

    // Enviar una por una 
    for (const notif of notificaciones) {
      try {
        const info = await sendEmail(
          notif.receptor,
          notif.asunto,
          notif.mensaje,
          notif.emisor
        );

        // Si el envío fue exitoso, marcar como enviada
        if (info !== "error") {
          notif.enviado = true;
          await notif.save();
          console.log(`Notificación ID ${notif.id} enviada correctamente`);
        } else {
          console.error(`Error al enviar notificación ID ${notif.id}`);
        }
      } catch (error) {
        console.error(`Excepción al enviar notificación ID ${notif.id}:`, error);
        // ¿reintentar o dejar como no enviada para la próxima ejecución?
      }
    }
  },
};