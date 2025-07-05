// emailService/src/producers/emailProducer.ts
import { connectAMQP } from "../config/amqpConfig";

export const publishEmail = async ({ to, subject, html }: { 
  to: string, 
  subject: string, 
  html: string 
}): Promise<boolean> => {
  try {
    const message = {
      to,
      subject,
      html
    };
    
    const channel = await connectAMQP();
    await channel.assertQueue("emailQueue", { durable: true }); // Que el mensaje no se elimine al apagar los servicios
    const sent = channel.sendToQueue(
      "emailQueue", 
      Buffer.from(JSON.stringify(message)),
      { persistent: true } 
    );
    
    return sent;
  } catch (error) {
    console.error("Error publishing email to queue:", error);
    return false;
  }
};