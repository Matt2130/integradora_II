import { connectAMQP } from '../config/amqpConfig';
import { sendEmail } from '../services/emailService';
import { getWelcomeTemplate } from '../templates/welcomeTemplate'; 
import { getResetPasswordTemplate} from '../templates/resetPasswordTemplate';

export const startEmailConsumer = async (): Promise<void> => {
  try {
    const channel = await connectAMQP();
    await channel.assertQueue('emailQueue', { durable: true });
    channel.prefetch(1);
    
    console.log('Waiting for email messages...');
    
    channel.consume('emailQueue', async (msg) => {
      if (!msg) return;
      
      try {
        const { type, data } = JSON.parse(msg.content.toString());
        
        let emailOptions;
        
        switch (type) {
          case 'welcome':
            emailOptions = {
              to: data.to,
              subject: 'Bienvenid@ a SUUDAI ACUAPONIA',
              html: getWelcomeTemplate(data.name || data.firstName) // se usa la plantilla existente
            };
            break;
            
          case 'resetPassword':
            emailOptions = {
              to: data.to,
              subject: 'Restablece tu contraseña - SUUDAI ACUAPONIA',
              html: getResetPasswordTemplate(data.name || data.firstName, data.token)
            };
            break;
            
          default:
            throw new Error(`Tipo de email no soportado: ${type}`);
        }
        
        await sendEmail(emailOptions);
        channel.ack(msg);
        console.log(`Email ${type} sent to ${data.to}`);
        
      } catch (error) {
        console.error('Error processing email:', error);
        channel.nack(msg, false, false);
      }
    });
    
    // Manejo de cierre limpio
    process.once('SIGINT', async () => {
      await channel.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Error in email consumer:', error);
    setTimeout(startEmailConsumer, 5000);
  }
};