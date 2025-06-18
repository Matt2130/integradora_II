import jwt from 'jsonwebtoken';
import { cache } from './cache';
import 'dotenv/config';

const ACCESS_SECRET = process.env.JWT_SECRET as string;

const timeToLive = 60 * 15; // 15 minutes

export const generateAccessToken = (userId: string, role: string) => {
    return jwt.sign(
        { userId, role },
        ACCESS_SECRET,
        { expiresIn: timeToLive }
    )
}


export const replaceAccessToken = (oldToken: string): string => {
  try {
    // Verificar token viejo
    const decoded = jwt.verify(oldToken, ACCESS_SECRET) as { userId: string; role: string };

    const { userId, role } = decoded;

    // Validar que esté en cache y que coincida
    const cachedToken = cache.get(userId);
    if (!cachedToken || cachedToken !== oldToken) {
      throw new Error('Token inválido o ya no existe');
    }

    // Eliminar token viejo
    cache.del(userId);

    // Generar nuevo token
    const newToken = generateAccessToken(userId, role);

    // Guardar nuevo token en cache
    cache.set(userId, newToken, timeToLive);

    return newToken;
  } catch (error) {
    throw new Error('No se pudo reemplazar el token: ' + (error as Error).message);
  }
};

export const validateToken = (token: string) => {
    const { userId } = jwt.verify(token, ACCESS_SECRET) as { userId: string };
    if (cache.get(userId) !== token) throw new Error('Token inválido');
    return userId;
};