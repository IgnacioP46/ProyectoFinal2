import express from 'express';
// --- CORRECCIÓN AQUÍ ---
// Cambiado de '../controllers/vinylController.js' a '../controllers/Vinyl.controller.js'
import { getVinyls, getVinylById, createVinyl, deleteVinyl } from '../controllers/Vinyl.controller.js';

const router = express.Router();

router.get('/', getVinyls);
router.post('/', createVinyl);
router.get('/:id', getVinylById);
router.delete('/:id', deleteVinyl);

export default router;