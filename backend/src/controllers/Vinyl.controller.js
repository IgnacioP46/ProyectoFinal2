import { Vinyl } from "../models/Vinyl.models.js";

export const getVinyls = async (req, res) => {
    try {
        // Busca todos los vinilos en la base de datos
        const vinyls = await Vinyl.find();

        // Responde al frontend con la lista
        res.json(vinyls);
    } catch (error) {
        console.error("Error obteniendo vinilos:", error);
        res.status(500).json({ message: "Error al obtener el catálogo" });
    }
};