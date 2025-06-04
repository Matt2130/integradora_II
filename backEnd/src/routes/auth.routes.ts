import { Router } from "express";
import { getTimeToken, loginMethod, updateToken, verifyUserByToken  } from '../controllers/auth.controller';
import { getAllUsers, getUserByEmail, createUser, updateDataUser, deleteUser } from '../controllers/users.controller';   
import { authenticate } from '../middlewares/authenticate';


const router = Router();

//AUTH-CONTROLLER
router.post('/login-user',loginMethod);
router.get('/timeTokenLife', getTimeToken);
router.put('/updateToken/:userId', updateToken);

//USERS-CONTROLLER
router.post('/createUser', createUser);
router.get('/getAllUsers', getAllUsers);
router.get('/getUser/:email', getUserByEmail)
router.put('/updateDataUser/:userId', authenticate, updateDataUser);
router.patch('/deleteUser/:userId', deleteUser);

export default router;