import { User } from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, street, number, floor, zipCode, city, province } = req.body;

    // 1. CIBERSEGURIDAD: Validar que el usuario no exista ya
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Este correo ya está registrado" });
    }

    // 2. CIBERSEGURIDAD: Encriptar la contraseña (Hash)
    // El '10' es el "salt", la complejidad del cifrado.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. LÓGICA DE ROLES: ¿Es el primer usuario del sistema?
    // Contamos cuántos usuarios hay en total.
    const isFirstAccount = (await User.countDocuments({})) === 0;
    // Si es el primero -> 'admin', si no -> 'user'
    const role = isFirstAccount ? "admin" : "user";

    // 4. Crear el usuario
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // ¡Guardamos la encriptada!
      address: { street, number, floor, zipCode, city, province },
      role: role 
    });

    await newUser.save();

    res.status(201).json({ 
      message: "Usuario registrado con éxito",
      role: role // Devolvemos el rol para que sepas cuál te tocó
    });

  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: "Error en el servidor al registrar usuario" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Credenciales inválidas" });

    // 2. CIBERSEGURIDAD: Comparar contraseña escrita con la encriptada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Credenciales inválidas" });

    // 3. Generar Token (Tu "carnet de identidad" digital)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET, // Asegúrate de tener esto en tu .env
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};