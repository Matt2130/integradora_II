import amqplib from 'amqplib';

export const connectAMQP = async () => {
  const connection = await amqplib.connect(process.env.CLOUDAMQP_URL as string);
  const channel = await connection.createChannel();
  return channel;
};