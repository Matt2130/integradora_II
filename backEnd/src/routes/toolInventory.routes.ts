import { Router, Request, Response, RequestHandler } from 'express';
import { createTool, getAllTools, getToolById, updateTool, deleteTool } from '../controllers/toolInventory.controller';
import { verifyUserByToken } from '../controllers/auth.controller';
import { replaceAccessToken } from '../utils/token';

const router = Router();

router.get(
    '/get-all',
    verifyUserByToken(['Adm1ni$trad0r', 'M4ntenim1ent0']),
    (req: Request, res: Response, next) => {
        // Assuming the token is in req.headers['authorization']
        const authHeader = req.headers['authorization'];
        const oldToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

        if (oldToken) {
            // Replace the token and attach to response or request as needed
            const newToken = replaceAccessToken(oldToken);
            // For example, set it in a response header
            res.setHeader('x-access-token', newToken);
        }
        next();
    },
    (req: Request, res: Response) => {
        getAllTools(req, res);
    }
);

router.get('/get-one/:id', verifyUserByToken(['Adm1ni$trad0r', 'M4ntenim1ent0']), (req: Request, res: Response) => {
    getToolById(req, res);
});

router.post('/new', verifyUserByToken(['Adm1ni$trad0r', 'M4ntenim1ent0']), (req: Request, res: Response) => {
    createTool(req, res);
});

router.put('/update/:id', verifyUserByToken(['Adm1ni$trad0r', 'M4ntenim1ent0']), (req: Request, res: Response) => {
    updateTool(req, res);
});

router.delete('/delete/:id', verifyUserByToken(['Adm1ni$trad0r', 'M4ntenim1ent0']), (req: Request, res: Response) => {
    deleteTool(req, res);
});

//Valida token
//elimina y crea token

export default router