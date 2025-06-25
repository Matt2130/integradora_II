import { Request, Response, Router } from "express";
import { createBotanicInventory, getAllInventories, getInventoryById, updateInventory, deletePlantFromInventory } from "../controllers/botanic.controller";
import { verifyUserByToken } from "../controllers/auth.controller";

const router = Router();

router.post('/createBotanic', verifyUserByToken(['Adm1ni$trad0r','B0t4nic0']), (req: Request, res: Response) => {
    createBotanicInventory(req, res);
});
router.get('/getAll/Inventory', verifyUserByToken(['Adm1ni$trad0r','B0t4nic0']), (req: Request, res: Response) => {
    getAllInventories(req, res);
});
router.get('/getById/:id', verifyUserByToken(['Adm1ni$trad0r','B0t4nic0']), (req: Request, res: Response) => {
    getInventoryById(req, res);
});
router.put('/updateInventory/data/:id', verifyUserByToken(['Adm1ni$trad0r','B0t4nic0']), (req: Request, res: Response) => {
     updateInventory(req, res);
});
router.delete('/deletePlant/:id', verifyUserByToken(['Adm1ni$trad0r','B0t4nic0']), (req: Request, res: Response) => {
    deletePlantFromInventory(req, res);
});

export default router;