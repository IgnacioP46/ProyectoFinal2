import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- AJUSTE DE RUTAS ---
// Estamos en: backend/data/_snapshots/
// Queremos ir a: backend/src/models/Vinyl.models.js
import { Vinyl } from '../../src/models/Vinyl.models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargamos el .env desde la raíz del backend (dos carpetas arriba)
dotenv.config({ path: path.join(__dirname, '../../.env') });

const resetVinyls = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("❌ No encuentro MONGODB_URI. Revisa la ruta del .env");

        console.log("🔌 Conectando a MongoDB...");
        // Forzamos la conexión a la base de datos correcta
        await mongoose.connect(uri, { dbName: 'DiscosRizos' });
        console.log("✅ Conectado a DiscosRizos");

        // 1. Leer el archivo JSON (debe estar en la MISMA carpeta que este script)
        const jsonPath = path.join(__dirname, 'vinyls_snapshot.json');
        
        if (!fs.existsSync(jsonPath)) {
            throw new Error(`❌ No encuentro el archivo de datos en: ${jsonPath}`);
        }

        const rawData = fs.readFileSync(jsonPath, 'utf-8');
        let vinylsData = JSON.parse(rawData);

        console.log(`📂 Leídos ${vinylsData.length} vinilos del archivo JSON.`);

        // 2. Borrar TODO lo antiguo (limpieza total)
        console.log("🗑️  Borrando colección 'vinyls' antigua...");
        await Vinyl.deleteMany({});
        console.log("✨ Colección vacía.");

        // 3. Formatear datos (Convertir textos a números)
        // Esto soluciona el problema de que no se guarden los precios al editar
        const formattedVinyls = vinylsData.map(v => ({
            ...v,
            price_eur: Number(v.price_eur) || 0, // "24.99" -> 24.99
            stock: Number(v.stock) || 0,         // "20" -> 20
            weight_g: Number(v.weight_g) || 0,
            year: Number(v.year) || null,
            speed_rpm: String(v.speed_rpm) // Nos aseguramos que sea string o number según prefieras
        }));

        // 4. Insertar datos limpios
        console.log("🚀 Insertando vinilos nuevos...");
        await Vinyl.insertMany(formattedVinyls);

        console.log("🎉 ¡ÉXITO! Base de datos restaurada y unificada.");
        process.exit();

    } catch (error) {
        console.error("🔥 Error crítico:", error);
        process.exit(1);
    }
};

resetVinyls();