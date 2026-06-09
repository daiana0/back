
import { Op } from 'sequelize';
import TokenBlacklist from '../modules/auth/model/TokenBlacklist.js';


/**
 * Elimina de la tabla token_blacklist todos los tokens cuya fecha
 * de expiración (exp) ya ha pasado.
 */
export async function cleanExpiredTokens(): Promise<void> {
  try {
    const deletedCount = await TokenBlacklist.destroy({
      where: {
        exp: { [Op.lt]: new Date() }, // exp menor que la fecha/hora actual
      },
    });

    if (deletedCount > 0) {
      console.log(`[TokenCleanup] ${deletedCount} tokens expirados eliminados de la blacklist.`);
    }
  } catch (error) {
    console.error('[TokenCleanup] Error al limpiar la blacklist:', error);
  }
}

/**
 * Programa la limpieza para que se ejecute inmediatamente al iniciar
 * y luego se repita cada 1 hora usando setInterval.
 */
export function startTokenCleanupScheduler(): void {
  cleanExpiredTokens(); // ejecutar al inicio
  const ONE_HOUR = 60 * 60 * 1000; // 1 hora en milisegundos
  setInterval(cleanExpiredTokens, ONE_HOUR);
  console.log('[TokenCleanup] Limpieza programada cada hora con setInterval.');
}