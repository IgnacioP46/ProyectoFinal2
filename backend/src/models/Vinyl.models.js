import mongoose from "mongoose";

const vinylSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    artist_name: { 
        type: String, 
        required: true 
    },
    // Aseguramos que el precio sea el que usas en el Dashboard (price_eur)
    price_eur: { 
        type: Number, 
        required: true 
    },
    stock: { 
        type: Number, 
        default: 0 
    },
    cover_image: {
        type: String
    },
    // Añadimos estos por si acaso tu base de datos los tiene y no queremos perderlos
    sku: String,
    year: Number,
    description: String,
    genre: String
}, {
    timestamps: true,
    // --- ESTO ES LO QUE ARREGLA EL PROBLEMA ---
    // Obliga a Mongoose a buscar en la lista 'vinyls' de 'DiscosRizos'
    collection: 'vinyls' 
});

export const Vinyl = mongoose.model("Vinyl", vinylSchema);