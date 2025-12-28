import { Router } from "express";
import { getVinyls } from "../controllers/Vinyl.controller.js";

const router = Router();

// Define la ruta base "/" (que será /api/vinyls gracias a app.js)
router.get("/", getVinyls);

export default router;