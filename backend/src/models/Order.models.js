import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    // El usuario ahora NO es requerido (required: false)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false 
    },
    // Añadimos campo para invitados
    guest_info: {
        name: String,
        email: String
    },
    items: [
        {
            vinyl: { type: mongoose.Schema.Types.ObjectId, ref: "Vinyl" },
            quantity: Number,
            price_at_purchase: Number
        }
    ],
    total_price: { type: Number, required: true },
    shipping_address: { type: String, required: true },
    status: { type: String, default: "pendiente" }
}, {
    timestamps: true
});

export const Order = mongoose.model("Order", orderSchema);