import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_GMAIL,
    pass: process.env.PASS_APP,
  },
});

/**
 * Envía un email transaccional con el link para restablecer la contraseña.
 * El template es propio (no comparte con el de notificaciones porque ese
 * tiene un wrapper de "📢 Notificación" que no aplica acá).
 */
export const enviarEmailRecuperacionContrasenia = async (
  to: string,
  nombre: string,
  linkRestablecer: string,
  expiracionEnMinutos: number,
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.USER_GMAIL,
      to,
      subject: 'SIGI · Restablecé tu contraseña',
      html: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 550px; margin: 0 auto; border: 1px solid #d4d4d4; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
  <div style="background: linear-gradient(135deg, #00425E 0%, #005B7F 100%); color: white; padding: 24px 28px; text-align: center;">
    <h2 style="margin: 0; font-weight: 600; letter-spacing: -0.5px;">Instituto Superior</h2>
    <p style="margin: 5px 0 0; font-size: 0.9rem; opacity: 0.9;">Santa Rosa de Calamuchita</p>
  </div>
  <div style="padding: 28px; background: #ffffff;">
    <p style="margin-top: 0; font-size: 1rem;">Hola ${nombre},</p>
    <p>Recibimos un pedido para restablecer la contraseña de tu cuenta en SIGI. Para continuar, tocá el botón:</p>
    <div style="text-align: center; margin: 28px 0;">
      <a href="${linkRestablecer}"
         style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #00425E 0%, #005B7F 100%); color: #ffffff; text-decoration: none; font-weight: 700; border-radius: 24px; font-size: 1rem;">
        Restablecer contraseña
      </a>
    </div>
    <p style="font-size: 0.9rem; color: #555;">
      Si el botón no funciona, copiá y pegá esta dirección en tu navegador:<br>
      <span style="word-break: break-all; color: #00425E;">${linkRestablecer}</span>
    </p>
    <div style="background-color: #FFDCC7; border-left: 5px solid #c25a1e; padding: 12px 18px; margin: 24px 0; border-radius: 6px; color: #311300;">
      <p style="margin: 0;"><strong>⏱ Importante:</strong> Este enlace expira en ${expiracionEnMinutos} minutos. Si no lo usás a tiempo, vas a tener que volver a pedir el restablecimiento.</p>
    </div>
    <p style="font-size: 0.9rem; color: #555; margin-bottom: 0;">
      Si vos no solicitaste este cambio, ignorá este email y tu contraseña seguirá igual.
    </p>
  </div>
  <div style="background-color: #f2f2f2; padding: 12px; text-align: center; font-size: 12px; color: #6c6c6c; border-top: 1px solid #e0e0e0;">
    Instituto Superior Santa Rosa de Calamuchita · Este es un correo automático, no respondas a este mensaje.
  </div>
</div>
`,
    });
  } catch (err) {
    // Best-effort: si el envío falla, igual respondemos 200 al cliente
    // (para no revelar si el email existe). Logueamos para diagnóstico.
    console.error('[recuperacionEmail] Falló el envío del email:', (err as Error).message);
  }
};
