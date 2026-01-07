import { Router } from "express";
import auth from "../middleware/auth.js"; 
import { getMyOrders, createOrder } from "../controllers/Order.controllers.js"; 

const router = Router();

router.get("/my-orders", auth, getMyOrders);
router.post('/', auth, createOrder);

export default router;