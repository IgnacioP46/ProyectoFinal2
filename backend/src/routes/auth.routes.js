import { Router } from "express";
import { User } from "../models/User.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Necesitas esto para el login

const router = Router();

// --- REGISTRO ---
router.post("/register", async (req, res) => {
  try {
    console.log("📥 Petición de registro recibida:", req.body);

    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: passwordHash });
    console.log("✅ Usuario creado con ID:", user._id);

    res.json({ id: user._id });
  } catch (error) {
    console.error("🔥 Error en el servidor:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- LOGIN (Faltaba o hay que asegurarse de que esté) ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    // Comprobar contraseña (user.password es el hash en tu modelo)
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(401).json({ error: "Credenciales inválidas" });

    // Crear Token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ¡ESTA ES LA LÍNEA QUE TE FALTABA! ---
export default router;