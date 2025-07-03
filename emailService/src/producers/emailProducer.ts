import { connectAMQP } from "../config/amqpConfig";

export const publishEmail = async ({ to, subject, html }: { to: string, subject: string, html: string }) => {
  const message = {
    to,
    subject,
    html
  };
  const channel = await connectAMQP();
  await channel.assertQueue("emailQueue");
  channel.sendToQueue("emailQueue", Buffer.from(JSON.stringify(message)));
};