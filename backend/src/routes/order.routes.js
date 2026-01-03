import { Router } from "express";
// 1. Importamos el middleware
import auth from "../middleware/auth.js"; 

// 2. Importamos controladores
import { getMyOrders, createOrder } from "../controllers/Order.controllers.js"; 

const router = Router();

// 3. USO DEL MIDDLEWARE: 
// 🔴 ANTES (Error): auth() 
// 🟢 AHORA (Correcto): auth  <--- Sin paréntesis
router.get("/my-orders", auth, getMyOrders);

// Ruta de crear orden
router.post('/', auth, createOrder);

export default router;