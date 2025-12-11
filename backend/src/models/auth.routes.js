import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = Router();

// Registro
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, address } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ name, email, password: hashedPassword, address });
        res.status(201).json({ message: "Usuario creado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET
        );

        res.json({ token, user: { id: user._id, name: user.name, role: user.role, address: user.address, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar perfil
router.put("/profile/:id", async (req, res) => {
    // Nota: En producción deberías verificar el token aquí
    try {
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
        res.json(updated);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;