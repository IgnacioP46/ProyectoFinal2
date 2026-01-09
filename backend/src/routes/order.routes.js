import { Router } from "express";
import auth, { optionalAuth } from "../middleware/auth.js"; 
import { getMyOrders, createOrder } from "../controllers/Order.controllers.js"; 

const router = Router();

// Ruta para ver historial: ESTRICTA (auth)
router.get("/my-orders", auth, getMyOrders);

// Ruta para comprar: OPCIONAL (optionalAuth) -> Permite invitados
router.post('/', optionalAuth, createOrder); 

export default router;