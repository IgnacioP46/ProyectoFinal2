import { Order } from "../models/Order.models.js";

// Obtener pedidos
export const getMyOrders = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Usuario no identificado" });
        }
        const orders = await Order.find({ user: req.user.id })
            .populate("items.vinyl", "title artist_name cover_image")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener historial" });
    }
};

// Crear pedido (Este es el que te fallaba, aquí vemos el error real)
export const createOrder = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Debes estar logueado" });
        }

        const { items, total_price, shipping_address } = req.body;
        
        console.log("📦 Datos recibidos:", JSON.stringify(req.body, null, 2));

        const newOrder = new Order({
            user: req.user.id,
            items,
            total_price,
            shipping_address
        });

        await newOrder.save();
        res.status(201).json(newOrder);

    } catch (error) {
        console.error("🔥 Error al guardar:", error.message);
        res.status(400).json({ 
            message: "Error en los datos del pedido", 
            error: error.message 
        });
    }
};