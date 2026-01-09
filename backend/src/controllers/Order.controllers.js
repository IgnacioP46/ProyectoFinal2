import { Order } from "../models/Order.models.js";

// Obtener pedidos (Solo usuarios logueados)
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

// Crear pedido (Usuarios registrados O Invitados)
export const createOrder = async (req, res) => {
    try {
        const { items, total_price, shipping_address, guest_info } = req.body;

        // 1. Detectamos si es usuario o invitado
        // Si optionalAuth detectó token, req.user existirá. Si no, será null.
        const userId = req.user ? req.user.id : null;
        
        // 2. Validación de seguridad:
        // Si NO hay usuario logueado Y TAMPOCO hay datos de invitado, bloqueamos.
        if (!userId && !guest_info) {
             return res.status(400).json({ message: "Faltan datos: Debes loguearte o rellenar el formulario de invitado." });
        }

        console.log("📦 Procesando pedido...");
        console.log("   - Comprador:", userId ? "Usuario Registrado" : "Invitado (" + guest_info?.email + ")");

        // 3. Crear el pedido
        // NO BUSCAMOS EN LA DB DE USUARIOS. Simplemente guardamos el ID si lo hay, o null si no.
        const newOrder = new Order({
            user: userId,         
            guest_info: userId ? null : guest_info, 
            items,
            total_price,
            shipping_address
        });

        await newOrder.save();
        
        console.log("✅ Pedido guardado con éxito:", newOrder._id);
        res.status(201).json(newOrder);

    } catch (error) {
        console.error("❌ Error al crear pedido:", error);
        res.status(500).json({ message: "Error interno al procesar el pedido" });
    }
};