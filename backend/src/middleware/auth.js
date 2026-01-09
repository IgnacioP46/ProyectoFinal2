import jwt from "jsonwebtoken";

// 1. Middleware ESTRICTO (Para ver perfil, mis pedidos, etc.)
// Obliga a tener token. Si no, da error.
const authMiddleware = (req, res, next) => {
    try {
        const token = (req.headers.authorization || "").replace(/^Bearer\s+/, "");

        if (!token) {
            return res.status(401).json({ message: "No hay token de acceso" });
        }

        const secret = process.env.JWT_SECRET || "tu_palabra_secreta_si_no_esta_en_env";
        const decoded = jwt.verify(token, secret);

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};

// 2. Middleware OPCIONAL (Para comprar)
// Si tiene token lo usa, si no, deja pasar como invitado (req.user = null).
export const optionalAuth = (req, res, next) => {
    try {
        const token = (req.headers.authorization || "").replace(/^Bearer\s+/, "");

        if (token) {
            const secret = process.env.JWT_SECRET || "tu_palabra_secreta_si_no_esta_en_env";
            const decoded = jwt.verify(token, secret);
            req.user = decoded; // Es usuario registrado
        } else {
            req.user = null; // Es invitado
        }
        next();
    } catch (error) {
        req.user = null; // Si el token está mal, lo tratamos como invitado
        next();
    }
};

// Exportamos por defecto el estricto, y aparte el opcional
export default authMiddleware;