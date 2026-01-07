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
    sku: String,
    year: Number,
    description: String,
    genre: String
}, {
    timestamps: true,
    collection: 'vinyls' 
});

export const Vinyl = mongoose.model("Vinyl", vinylSchema);