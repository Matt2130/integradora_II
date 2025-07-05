export const getResetPasswordTemplate = (name: string, link: string) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Restablecer Contraseña - SUUDAI ACUAPONIA</title>
  </head>
  <body style="background-color: #FBF9FF; font-family: Arial, sans-serif; color: #000000; margin: 0; padding: 0;">

    <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #09392C; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #257C65; padding: 20px; text-align: center;">
        <h1 style="color: #FFFFFF; margin: 0;">Restablecer Contraseña</h1>
      </div>

      <div style="padding: 20px;">
        <p style="font-size: 16px;">Hola <strong>${name}</strong>,</p>

        <p style="font-size: 16px;">
          Recibimos una solicitud para restablecer tu contraseña en SUUDAI ACUAPONIA.
        </p>
        <p style="font-size: 16px;">
          Haz clic en el siguiente botón para crear una nueva contraseña:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" target="_blank"
            style="background-color: #09392C; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 4px; display: inline-block;">
            Restablecer contraseña
          </a>
        </div>

        <p style="font-size: 16px;">
          Si tú no solicitaste este cambio, puedes ignorar este correo.
        </p>

        <p style="font-size: 14px; color: #257C65; text-align: center;">
          Desarrollado por <strong>Aetherion Technologies</strong>
        </p>
      </div>

      <div style="background-color: #09392C; padding: 10px; text-align: center;">
        <p style="color: #FFFFFF; font-size: 12px; margin: 0;">
          &copy; 2025 SUUDAI ACUAPONIA. Todos los derechos reservados.
        </p>
      </div>
    </div>

  </body>
  </html>
  `;
};