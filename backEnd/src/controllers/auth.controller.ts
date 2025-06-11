import { Request, Response, NextFunction } from "express";
import { generateAccessToken, validateToken } from "../utils/token";
import jwt from "jsonwebtoken";
import { cache } from "../utils/cache";
import dayjs from "dayjs";
import { User } from "../models/User"
import bcrypt from "bcrypt";

//En este archivo están todos los métodos relacionados con el token | controlador User

const ACCESS_SECRET = process.env.JWT_SECRET as string;

export const verifyUserByToken = (requiredRole?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ message: 'Token no proporcionado.' });

      const decoded: any = jwt.verify(token, ACCESS_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

      if (requiredRole && user.role !== requiredRole) {
        return res.status(403).json({ message: 'Acceso denegado.' });
      }

      if (cache.get(decoded.userId) !== token) {
        return res.status(401).json({ message: 'Token inválido o expirado.' });
      }

      (req as any).user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
  };
};

export const loginMethod = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const userId = user._id.toString();
    const accessToken = generateAccessToken(userId, user.role);

    cache.set(userId, accessToken, 60 * 15);
      return res.status(200).json({ message: "Inicio de sesión exitoso", accessToken });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al logear usuario" });
  }
};

export const getTimeToken = (req: Request, res: Response) => {
    try {
        // Obtener y validar token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new Error('Token requerido');
        
        const userId = validateToken(token);

        const ttl = cache.getTtl(userId);
        if (!ttl) throw new Error('Token expirado');

        const now = Date.now();
        const timeToLife = Math.floor((ttl - now) / 1000);
        const expTime = dayjs(ttl).format('HH:mm:ss');

        return res.json({ 
            creadoPor: userId,  // Aquí va quién creó el token
            timeToLife,
            expTime 
        });

    } catch (error) {
        return res.status(401).json({ message: error instanceof Error ? error.message : 'Error desconocido' });
    }
};

export const updateToken = (req: Request, res: Response) => {
  try { 
    const { userId } = req.params;
    const ttl = cache.getTtl(userId); //Tiempo de vida del token

    if (!ttl){
        return res.status(404).json({ message: "Token invalido o no existe" });
    }

    const newTimeToken: number = 60 * 15;
    cache.ttl(userId, newTimeToken); //Actualizar el tiempo de vida

    res.json({ message: "Actualizado con exitó" });
  } catch (error) {
      return res.status(500).json({ message: "Error al actualizar el token"})
  }
};
