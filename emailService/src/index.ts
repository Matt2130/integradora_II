import express from 'express';
import 'dotenv/config';
import connectDB from './config/db';
import { consumeEmails } from './consumers/emailConsumer';

const app = express();
app.disable('x-powered-by'); // Desactiva el header para no exponer la tecnologpia usada en el back
const PORT = process.env.PORT_SERVER || 3000;

app.use(express.json());

app.listen(PORT, async () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
  await connectDB();
  await consumeEmails();
});