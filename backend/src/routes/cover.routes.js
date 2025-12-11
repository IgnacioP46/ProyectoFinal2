import { Router } from "express";
const router = Router();

// Por ahora, solo devolvemos un estado OK. 
// Aquí podrías implementar subida de archivos con 'multer' en el futuro.
router.post("/upload", (req, res) => {
  res.json({ message: "Endpoint de subida de carátulas (Pendiente de implementar)" });
});

export default router;