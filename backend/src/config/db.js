import mongoose from 'mongoose';

const connectDB = async (uri) => {
    try {
        // Imprimimos para verificar qué URI está llegando (solo para depurar)
        console.log("🔌 Conectando a MongoDB...");

        const conn = await mongoose.connect(uri, {
            // ESTO ES LO IMPORTANTE: Fuerza el nombre de la base de datos
            dbName: 'DiscosRizos' 
        });

        console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
        console.log(`📂 Base de datos activa: ${conn.connection.name}`); // Debería decir 'DiscosRizos'
    } catch (error) {
        console.error(`🔥 Error de conexión: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;