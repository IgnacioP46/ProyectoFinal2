import { Router } from "express";
import { Order } from "../models/Order.models.js";
import { User } from "../models/User.models.js";

const router = Router();

// CREAR UN PEDIDO (Checkout)
router.post("/", async (req, res) => {
  try {
    const { user_id, guest_info, items, total } = req.body;

    const newOrder = await Order.create({
      user: user_id || null, // Si viene user_id, lo guardamos
      guest_info: user_id ? null : guest_info, // Si es user, no guardamos guest_info (ya está en su perfil)
      items,
      total
    });

    // Si es usuario registrado, añadimos el pedido a su historial
    if (user_id) {
      await User.findByIdAndUpdate(user_id, { $push: { orders: newOrder._id } });
    }

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// OBTENER PEDIDOS DE UN USUARIO (Para el Perfil)
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo pedidos" });
  }
});

export default router;