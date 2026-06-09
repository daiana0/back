import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER_GMAIL,
        pass: process.env.PASS_APP,
    },
});

const sendEmail = async (to: string, subject: string, text: string, emisor: string) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.USER_GMAIL,
            to,
            subject,
            html: `<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 550px; margin: 0 auto; border: 1px solid #d4d4d4; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
    <div style="background: linear-gradient(135deg, #1e3c2c 0%, #2a5a3a 100%); color: white; padding: 20px 25px; text-align: center;">
        <h2 style="margin: 0; font-weight: 600; letter-spacing: -0.5px;">Instituto Superior</h2>
        <p style="margin: 5px 0 0; font-size: 0.9rem; opacity: 0.9;">Santa Rosa de Calamuchita</p>
    </div>
    <div style="padding: 25px; background: #ffffff;">
        <p style="margin-top: 0; font-size: 1rem;">Estimada comunidad,</p>
        <p>Desde el <strong>Instituto Superior Santa Rosa de Calamuchita</strong> deseamos notificarle lo siguiente:</p>
        <div style="background-color: #f7f9fc; border-left: 5px solid #2a5a3a; padding: 12px 18px; margin: 20px 0; border-radius: 6px;">
            <p style="margin: 0; color: #2c3e2f;"><strong>📢 Notificación:</strong> ${text}</p>
        </div>
        <p>Correo enviado por: ${emisor}</p>
        <p>Recuerde que este correo no debe ser respondido, ya que es un correo automático.</p>
        <p style="margin-bottom: 0;">Atentamente,<br><strong>Secretaría Académica</strong></p>
    </div>
    <div style="background-color: #f2f2f2; padding: 12px; text-align: center; font-size: 12px; color: #6c6c6c; border-top: 1px solid #e0e0e0;">
        Instituto Superior Santa Rosa de Calamuchita · Comprometidos con tu futuro
    </div>
</div>`,
        })
        console.log(info)
        return info;
    } catch (err) {
        console.log((err as Error).message)
        return "error";
    }
}

export default sendEmail;