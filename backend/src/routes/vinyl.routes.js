import { Router } from "express";
import { getAllVinyls } from "../controllers/Vinyl.controller.js";

const router = Router();
router.get("/", getAllVinyls);


export default router;
