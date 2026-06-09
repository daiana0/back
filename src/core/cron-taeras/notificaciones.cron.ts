// cron-jobs/notificaciones.cron.ts
import cron from 'node-cron';
import { notificacionService } from '../../modules/notificacionesXEmail/service/notificacionXEmail.service.js';


const notificacionesCron = (): void => {
    // Prioridad alta: cada 1 minuto
    cron.schedule('*/1 * * * *', async () => {
        console.log('Ejecutando envío de notificaciones de prioridad alta...');
        await notificacionService.envioEmail('alta');
    });

    // Prioridad media: cada 10 minutos
    cron.schedule('*/10 * * * *', async () => {
        console.log('Ejecutando envío de notificaciones de prioridad media...');
        await notificacionService.envioEmail('media');
    });

    // Prioridad baja: cada 15 minutos
    cron.schedule('*/15 * * * *', async () => {
        console.log('Ejecutando envío de notificaciones de prioridad baja...');
        await notificacionService.envioEmail('baja');
    });

    console.log('Tareas cron de notificaciones programadas.');
};

export { notificacionesCron };
