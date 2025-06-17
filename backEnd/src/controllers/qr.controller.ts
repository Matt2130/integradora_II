import { Request, Response } from "express";
import {
  createQRSession,
  getTokenForQR,
  linkTokenToQR,
} from "../utils/qrCache";

export const handleCreateQR = (req: Request, res: Response) => {
  const { sessionCode } = req.body;
  if (!sessionCode) {
    return res.status(400).json({ message: "sessionCode requerido" });
  }
  createQRSession(sessionCode);
  return res.sendStatus(200);
};

export const handleLinkToken = (req: Request, res: Response) => {
  const { sessionCode } = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!sessionCode || !token) {
    return res.status(400).json({ message: "Token y sessionCode requeridos" });
  }

  const success = linkTokenToQR(sessionCode, token);
  return success
    ? res.sendStatus(200)
    : res.status(404).json({ message: "Código no válido o expirado" });
};

export const handleQRStatus = (req: Request, res: Response) => {
  const { sessionCode } = req.params;
  if (!sessionCode) {
    return res.status(400).json({ message: "sessionCode requerido" });
  }

  const token = getTokenForQR(sessionCode);
  res.json({ token });
};
