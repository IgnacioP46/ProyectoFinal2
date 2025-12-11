import { Router } from "express";
import Artist from "../models/Artist.models.js";

const router = Router();

// Buscador de artistas
router.get("/", async (req, res) => {
  const { q } = req.query;
  // Si hay query 'q', busca por texto. Si no, devuelve todo.
  const filter = q ? { $text: { $search: q } } : {};

  try {
    const items = await Artist.find(filter).limit(200);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;