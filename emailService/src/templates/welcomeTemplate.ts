export const getWelcomeTemplate = (name: string) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Bienvenid@s a SUUDAI ACUAPONIA</title>
  </head>
  <body style="background-color: #FBF9FF; font-family: Arial, sans-serif; color: #000000; margin: 0; padding: 0;">

    <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #09392C; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #257C65; padding: 20px; text-align: center;">
        <h1 style="color: #FFFFFF; margin: 0;">Bienvenid@s a SUUDAI ACUAPONIA</h1>
      </div>

      <div style="padding: 20px;">
        <p style="font-size: 16px;">Hola <strong>${name}</strong>,</p>

        <p style="font-size: 16px;">
          Nos complace darle la bienvenida a <strong>SUUDAI ACUAPONIA</strong>, su sistema inteligente de gestión de invernaderos acuapónicos.
          A partir de ahora, podrás acceder a herramientas para supervisar sensores, controlar recursos y gestionar tus cultivos desde un único lugar.
        </p>

        <p style="font-size: 16px;">
          Gracias por tu registro!
        </p>


        <p style="font-size: 14px; color: #257C65; text-align: center;">
          Developed by <strong>Aetherion Technologies</strong>
        </p>
      </div>

      <div style="background-color: #09392C; padding: 10px; text-align: center;">
        <p style="color: #FFFFFF; font-size: 12px; margin: 0;">
          &copy; 2025 SUUDAI ACUAPONIA. All rights reserved.
        </p>
      </div>
    </div>

  </body>
  </html>
  `;
};