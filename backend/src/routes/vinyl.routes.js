import { Router } from 'express';
// Importamos updateVinyl del controlador (donde pusimos los chivatos/logs)
import { 
    getVinyls, 
    getVinylById, 
    createVinyl, 
    deleteVinyl, 
    updateVinyl 
} from '../controllers/Vinyl.controller.js';

import auth from '../middleware/auth.js'; 

const router = Router();

// --- RUTAS PÚBLICAS ---
router.get('/', getVinyls);
router.get('/:id', getVinylById);

// --- RUTAS PROTEGIDAS (ADMIN) ---
router.post('/', auth, createVinyl);
router.delete('/:id', auth, deleteVinyl);

router.put('/:id', auth, updateVinyl); 

export default router;