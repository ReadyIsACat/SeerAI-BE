import { Router } from 'express';
import { TarotController } from '../controllers/tarotController';

const router = Router();
const tarotController = new TarotController();

// Health check endpoint
router.get('/health', tarotController.healthCheck.bind(tarotController));

// Generate tarot reading endpoint
router.post('/reading', tarotController.generateReading.bind(tarotController));

export default router; 