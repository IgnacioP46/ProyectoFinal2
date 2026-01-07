import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        // 1. Limpiamos el token (quitamos "Bearer ")
        const token = (req.headers.authorization || "").replace(/^Bearer\s+/, "");

        if (!token) {
            return res.status(401).json({ message: "No hay token de acceso" });
        }

        // 2. Verificamos la firma
        const secret = process.env.JWT_SECRET || "tu_palabra_secreta_si_no_esta_en_env";
        const decoded = jwt.verify(token, secret);

        // 3. Inyectamos el usuario en la petición y PASAMOS (next)
        req.user = decoded;
        next();

    } catch (error) {
        console.log("Error de Auth:", error.message);
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};

export default authMiddleware;