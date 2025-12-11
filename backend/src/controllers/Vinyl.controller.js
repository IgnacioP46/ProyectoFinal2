
import Vinyl from "../models/Vinyl.models.js";

export const getAllVinyls = async (req, res) => {
    try {
        const vinyls = await Vinyl.find({})
            .select("title artist_name price cover_image genre")
            .lean();
        res.json(vinyls);
    } catch (err) {
        console.error("getAllVinyls error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
const getVinylById = async (req, res) => {
    const { id } = req.params;
    try {
        const vinyl = await Vinyl.findById(id);
        if (!vinyl) return res.status(404).json({ error: "Vinyl not found" });
        res.json(vinyl);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const createVinyl = async (req, res) => {
    const newVinyl = req.body;
    try {
        const createdVinyl = await Vinyl.create(newVinyl);
        res.status(201).json(createdVinyl);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const updateVinyl = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const updatedVinyl = await Vinyl.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedVinyl) return res.status(404).json({ error: "Vinyl not found" });
        res.json(updatedVinyl);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const deleteVinyl = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedVinyl = await Vinyl.findByIdAndDelete(id);
        if (!deletedVinyl) return res.status(404).json({ error: "Vinyl not found" });
        res.json({ message: "Vinyl deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}



export default {
    getAllVinyls,
    getVinylById,
    createVinyl,
    updateVinyl,
    deleteVinyl
};