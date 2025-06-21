import { Router, Request, Response, NextFunction } from "express";
import { getTimeToken, loginMethod, verifyUserByToken } from '../controllers/auth.controller';
import { getAllUsers, getUserByEmail, createUser, updateDataUser, deleteUser } from '../controllers/users.controller';
import { authenticate } from '../middlewares/authenticate';
import { loginWithGoogle } from "../controllers/loginWithGoogle.controller";

const router = Router();

// AUTH-CONTROLLER

router.post('/login-user', (req: Request, res: Response) => {
  loginMethod(req, res);
});

router.get('/timeTokenLife', (req: Request, res: Response) => {
  getTimeToken(req, res);
});

router.post('/login-google', (req: Request, res: Response) => {
  loginWithGoogle(req, res);
});

// USERS-CONTROLLER

router.post('/createUser', (req: Request, res: Response) => {
  createUser(req, res);
});

router.get('/getAllUsers', verifyUserByToken(['Adm1ni$trad0r']), (req: Request, res: Response) => {
  getAllUsers(req, res);
});

router.get('/getUser/:email', verifyUserByToken(['Adm1ni$trad0r']), (req: Request, res: Response) => {
  getUserByEmail(req, res);
});

router.put('/updateDataUser/:userId', authenticate, (req: Request, res: Response) => {
  updateDataUser(req, res);
});

router.patch('/deleteUser/:userId', verifyUserByToken(['Adm1ni$trad0r']), (req: Request, res: Response) => {
  deleteUser(req, res);
});

export default router;
