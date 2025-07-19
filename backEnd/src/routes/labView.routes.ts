import { Router } from 'express';
import bodyParser from 'body-parser';
import { createSensorRegister, getLastSensorRegister } from '../controllers/sensor.controller';

const router = Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/createData', (req, res) => {
  createSensorRegister(req, res)
});

router.get('/lastRegister', async (req, res) => {
  getLastSensorRegister(req, res);
});

export default router;