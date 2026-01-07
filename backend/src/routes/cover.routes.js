import { Router } from "express";
const router = Router();

router.post("/upload", (req, res) => {
  res.json({ message: "Endpoint de subida de carátulas (Pendiente de implementar)" });
});

export default router;