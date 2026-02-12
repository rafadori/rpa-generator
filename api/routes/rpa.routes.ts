import { Router } from 'express';
import { RpaController } from '../controllers/rpa.controller';

const router = Router();
const rpaController = new RpaController();

router.post('/generate', rpaController.generate);
router.post('/validate', rpaController.validate);

export default router;
