import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import QRRoutes from './routes/qr.routes';
import connectDB from './config/db';
import 'dotenv/config';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT_SERVER as string;

// Configurar CORS para múltiples orígenes
const allowedOrigins = [process.env.URL_FRONT, process.env.URL_MOBILE];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`No permitido por CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/qr', QRRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("El servidor esta en el puerto:", PORT);
  });
});
