import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" }, // 'admin' o 'user'
    address: {
        street: String,
        city: String,
        zipCode: String
    }
}, {
    timestamps: true,
    collection: 'users' // <--- ESTO ES CLAVE: Forza la conexión a tu lista 'users'
});

export const User = mongoose.model("User", userSchema);