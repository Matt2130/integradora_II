import jwt from 'jsonwebtoken';
import { cache } from './cache';
import 'dotenv/config';

const ACCESS_SECRET = process.env.JWT_SECRET as string;

export const generateAccessToken = (userId: string, role: string) => {
    return jwt.sign(
        { userId, role },
        ACCESS_SECRET,
        { expiresIn: '15min' }
    )
}

export const validateToken = (token: string) => {
    const { userId } = jwt.verify(token, ACCESS_SECRET) as { userId: string };
    if (cache.get(userId) !== token) throw new Error('Token inválido');
    return userId;
};