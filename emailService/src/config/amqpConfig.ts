import * as amqp from 'amqplib';

type AMQPConnection = amqp.Connection & {
  createChannel(): Promise<amqp.Channel>;
  close(): Promise<void>;
};

type AMQPChannel = amqp.Channel & {
  close(): Promise<void>;
};

let channel: AMQPChannel | null = null;
let connection: AMQPConnection | null = null;

export const connectAMQP = async (): Promise<AMQPChannel> => {
  if (channel) return channel;

  try {
    // Conexión sin el incorrecto uso a ChannelModel
    connection = (await amqp.connect(process.env.CLOUDAMQP_URL || '')) as unknown as AMQPConnection;
    
    // Creación de canal
    channel = (await connection.createChannel()) as AMQPChannel;
    
    console.log('Connected to AMQP server');

    // Manejadores de eventos
    connection.on('close', () => {
      console.log('AMQP connection closed, reconnecting...');
      channel = null;
      connection = null;
      setTimeout(() => connectAMQP().catch(console.error), 5000);
    });

    connection.on('error', (err) => {
      console.error('AMQP connection error:', err);
    });

    return channel;
  } catch (error) {
    console.error('Error connecting to AMQP:', error);
    channel = null;
    connection = null;
    throw error;
  }
};

export const closeAMQP = async (): Promise<void> => {
  try {
    if (channel) {
      await (channel as AMQPChannel).close();
      channel = null;
    }
    if (connection) {
      await (connection as AMQPConnection).close();
      connection = null;
    }
    console.log('AMQP connection closed gracefully');
  } catch (error) {
    console.error('Error closing AMQP connection:', error);
    throw error;
  }
};