import express from 'express';
import getAllMonitoringAreas from '../controllers/streetController.js';

const router = express.Router();

router.get('/', getAllMonitoringAreas);

export default router;
