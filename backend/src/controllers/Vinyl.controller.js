import mongoose from 'mongoose';
import { Vinyl } from "../models/Vinyl.models.js"; // ¡IMPORTANTE: poner .js al final!

// 1. Obtener todos (Catálogo)
export const getVinyls = async (req, res) => {
    try {
        const vinyls = await Vinyl.find();
        res.json(vinyls);
    } catch (error) {
        console.error("Error en getVinyls:", error);
        res.status(500).json({ message: "Error al obtener catálogo" });
    }
};

// 2. Obtener uno por ID (Producto)
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

// 3. Crear vinilo (Para Admin)
export const createVinyl = async (req, res) => {
    try {
        const newVinyl = new Vinyl(req.body);
        await newVinyl.save();
        res.status(201).json(newVinyl);
    } catch (error) {
        res.status(400).json({ message: "Error creando vinilo" });
    }
};

// 4. Borrar vinilo (Para Admin)
export const deleteVinyl = async (req, res) => {
    try {
        const { id } = req.params;
        await Vinyl.findByIdAndDelete(id);
        res.json({ message: "Vinilo eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error eliminando" });
    }
};