import { Router } from "express";
import { User } from "../models/User.models.js"; // Importamos el modelo arreglado
import auth from "../middleware/auth.js";

const router = Router();

// 1. OBTENER TODOS LOS USUARIOS (GET /api/users)
router.get("/", auth, async (req, res) => {
    try {
        console.log("🔍 AdminDashboard: Buscando usuarios en DB...");
        
        // Buscamos todos los usuarios
        const users = await User.find().select("-password"); // Ocultamos la contraseña
        
        console.log(`✅ Usuarios encontrados: ${users.length}`);
        res.json(users);
    } catch (error) {
        console.error("🔥 Error crítico buscando usuarios:", error);
        res.status(500).json({ error: "No se pudieron cargar los usuarios" });
    }
});

// 2. CAMBIAR ROL (PUT /api/users/:id/role)
router.put("/:id/role", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body; // 'admin' o 'user'

        console.log(`🔄 Cambiando rol del usuario ${id} a: ${role}`);

        const updatedUser = await User.findByIdAndUpdate(
            id, 
            { role }, 
            { new: true } // Devuelve el usuario ya modificado
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error("🔥 Error cambiando rol:", error);
        res.status(500).json({ error: "Error al actualizar rol" });
    }
});

export default router;