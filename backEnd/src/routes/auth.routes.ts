import { Router, Request, Response } from "express";
import { getTimeToken, loginMethod, verifyUserByToken  } from '../controllers/auth.controller';
import { getAllUsers, getUserByEmail, createUser, updateDataUser, deleteUser } from '../controllers/users.controller';   
import { authenticate } from '../middlewares/authenticate';
import { replaceAccessToken } from "../utils/token";
import { loginWithGoogle } from "../controllers/loginWithGoogle.controller";


const router = Router();

//AUTH-CONTROLLER
router.post('/login-user', loginMethod);
router.get('/timeTokenLife', getTimeToken);

router.post('/refresh-token', (req: Request, res: Response) => {
  const oldToken = req.headers.authorization?.split(' ')[1];

  try {
    const newToken = replaceAccessToken(oldToken!); // ya definimos esta función antes
    res.json({ token: newToken });
  } catch (err) {
    res.status(401).json({ message: (err as Error).message });
  }
});

router.post('/login-google', (req: Request, res: Response) => {
  loginWithGoogle(req, res);
})


//USERS-CONTROLLER
router.post('/createUser', createUser);
router.get('/getAllUsers', verifyUserByToken(), getAllUsers);
router.get('/getUser/:email', verifyUserByToken(['Adm1ni$trad0r']), getUserByEmail)
router.put('/updateDataUser/:userId', authenticate, updateDataUser);
router.patch('/deleteUser/:userId', verifyUserByToken(['Adm1ni$trad0r']), deleteUser);

export default router;
