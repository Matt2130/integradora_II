import { connectAMQP } from "../config/amqpConfig";
import { sendWelcomeEmail } from "../services/emailService";

export const consumeEmails = async () => {
  const channel = await connectAMQP();
  await channel.assertQueue("emailQueue");
  console.log("Esperando mensajes...");

  channel.consume("emailQueue", async (message) => {
    if (message) {
      const { to, subject, html } = JSON.parse(message.content.toString());
      await sendWelcomeEmail(to, subject, html);
      console.log(`Email enviado a ${to}`);
      channel.ack(message);
    }
  });
};