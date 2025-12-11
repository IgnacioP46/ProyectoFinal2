import { Router } from "express";
import { Vinyl } from "../models/Vinyl.models.js";

const router = Router();

// GET Vinilos (Buscador + Aleatorio)
router.get("/", async (req, res) => {
    const { q } = req.query;
    let query = { active: true };

    if (q) {
        // Búsqueda insensible a mayúsculas
        query.$or = [
            { title: { $regex: q, $options: "i" } },
            { artist_name: { $regex: q, $options: "i" } }
        ];
    }

    try {
        let vinyls;
        if (!q) {
            // Si no busca nada, devolvemos aleatorios (sample)
            vinyls = await Vinyl.aggregate([{ $match: { active: true } }, { $sample: { size: 20 } }]);
        } else {
            vinyls = await Vinyl.find(query);
        }
        res.json(vinyls);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST (Crear - Solo Admin)
router.post("/", async (req, res) => {
    try {
        const newVinyl = await Vinyl.create(req.body);
        res.json(newVinyl);
    } catch (e) { res.status(400).json({ error: e.message }); }
});

// PUT y DELETE (Admin)
router.put("/:id", async (req, res) => {
    await Vinyl.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true });
});
router.delete("/:id", async (req, res) => {
    await Vinyl.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

export default router;