import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  // --- ACTUALIZADO PARA COINCIDIR CON EL FORMULARIO ---
  address: {
    street: { type: String, default: "" },
    number: { type: String, default: "" }, // Mejor String por si ponen "12 Bis"
    floor: { type: String, default: "" },
    zipCode: { type: String, default: "" }, // Cambiado de 'zip' a 'zipCode'
    city: { type: String, default: "" },
    province: { type: String, default: "" } // Añadido
  }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);