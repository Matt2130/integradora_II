import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Conexión con Mongo exitosa');
  } catch (error) {
    console.error('Fallo la conexión con Mongo:', error);
  }
};

export default connectDB;