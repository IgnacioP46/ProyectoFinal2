import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    address: {
        street: String,
        city: String,
        zipCode: String
    }
}, {
    timestamps: true,
    collection: 'users'
});

export const User = mongoose.model("User", userSchema);