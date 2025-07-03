export const getResetPasswordTemplate = (name: string, link: string) => {
  return `
  <html>
  <body>
    <h2>Hola ${name},</h2>
    <p>Recibimos una solicitud para restablecer tu contraseña en SUUDAI ACUAPONIA.</p>
    <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
    <a href="${link}" style="background-color: #257C65; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      Restablecer contraseña
    </a>
    <p>Si tú no solicitaste este cambio, puedes ignorar este correo.</p>
    <p>— Aetherion Technologies</p>
  </body>
  </html>
  `;
};
