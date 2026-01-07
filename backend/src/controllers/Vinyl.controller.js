import mongoose from 'mongoose';
import { Vinyl } from "../models/Vinyl.models.js";

// 1. Obtener todos los vinilos (Catálogo)
export const getVinyls = async (req, res) => {
    try {
        const vinyls = await Vinyl.find();
        res.json(vinyls);
    } catch (error) {
        console.error("Error en getVinyls:", error);
        res.status(500).json({ message: "Error al obtener catálogo" });
    }
};

// 2. Obtener un vinilo por ID
export const getVinylById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar formato ID MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'ID no válido' });
        }

        const vinyl = await Vinyl.findById(id);

        if (!vinyl) {
            return res.status(404).json({ message: 'Vinilo no encontrado' });
        }

        res.json(vinyl);
    } catch (error) {
        console.error("Error en getVinylById:", error);
        res.status(500).json({ message: "Error servidor" });
    }
};

// 3. Crear un nuevo vinilo (Admin)
export const createVinyl = async (req, res) => {
    try {
        const newVinyl = new Vinyl(req.body);
        await newVinyl.save();
        res.status(201).json(newVinyl);
    } catch (error) {
        res.status(400).json({ message: "Error al crear vinilo", error: error.message });
    }
};

// 4. Eliminar un vinilo (Admin)
export const deleteVinyl = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'ID no válido' });
        }

        const deletedVinyl = await Vinyl.findByIdAndDelete(id);
        
        if (!deletedVinyl) {
            return res.status(404).json({ message: "Vinilo no encontrado" });
        }

        res.json({ message: "Vinilo eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar vinilo" });
    }
};

// 5. Actualizar un vinilo (Admin)
export const updateVinyl = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`📝 Intento de editar vinilo ID: ${id}`);
        console.log("📦 Datos recibidos del Frontend:", req.body);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'ID no válido' });
        }

        // { new: true } devuelve el objeto actualizado
        const updatedVinyl = await Vinyl.findByIdAndUpdate(id, req.body, { new: true });
        
        if (!updatedVinyl) {
            console.log("❌ No se encontró el vinilo para actualizar");
            return res.status(404).json({ message: "Vinilo no encontrado" });
        }

        console.log("✅ Actualización exitosa en BBDD");
        res.json(updatedVinyl);

    } catch (error) {
        console.error("🔥 Error en updateVinyl:", error);
        res.status(500).json({ message: "Error al actualizar vinilo" });
    }
};