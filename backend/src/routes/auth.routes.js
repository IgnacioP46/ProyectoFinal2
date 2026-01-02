import { Router } from "express";
// --- CORRECCIÓN AQUÍ: Añadida la 's' y las llaves { } ---
import { User } from "../models/User.models.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

// --- REGISTRO ---
router.post("/register", async (req, res) => {
  try {
    console.log("📥 Petición de registro recibida:", req.body);

    const { 
        name, email, password, 
        street, number, floor, zipCode, city, province 
    } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Comprobar si existe
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    // Encriptar password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Lógica Primer Usuario = Admin
    const userCount = await User.countDocuments({});
    const role = userCount === 0 ? "admin" : "user";

    // Crear usuario
    const user = await User.create({ 
        name, 
        email, 
        password: passwordHash,
        role: role,
        address: {
            street,
            number,
            floor,
            zipCode,
            city,
            province
        }
    });

    console.log(`✅ Usuario creado: ${user.email} con rol: ${role}`);

    res.status(201).json({ 
        id: user._id,
        role: user.role,
        message: "Usuario registrado con éxito"
    });

  } catch (error) {
    console.error("🔥 Error en el servidor:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        role: user.role, 
        email: user.email,
        address: user.address 
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;