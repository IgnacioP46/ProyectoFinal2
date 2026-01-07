import mongoose from 'mongoose';

const connectDB = async (uri) => {
    try {
        console.log("🔌 Conectando a MongoDB...");

        const conn = await mongoose.connect(uri, {
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