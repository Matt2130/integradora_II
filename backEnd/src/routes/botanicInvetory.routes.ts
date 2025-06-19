import { Request, Response, Router } from "express";
import { createBotanicInventory, getAllInventories, getInventoryById, updateInventory, deletePlantFromInventory } from "../controllers/botanic.controller";

const router = Router();

router.post('/createBotanic', (req: Request, res: Response) => {
    createBotanicInventory(req, res);
});
router.get('/getAll/Inventory', (req: Request, res: Response) => {
    getAllInventories(req, res);
});
router.get('/getById/:id', (req: Request, res: Response) => {
    getInventoryById(req, res);
});
router.put('/updateInventory/data/:id', (req: Request, res: Response) => {
     updateInventory(req, res);
});
router.delete('/deletePlant/:id', (req: Request, res: Response) => {
    deletePlantFromInventory(req, res);
});

export default router;