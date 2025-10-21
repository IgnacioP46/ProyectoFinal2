const user = require("../models/User.models");

const getUsers = async (req, res) => {
    try {
        const users = await user.find();
       res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await user.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const createUser = async (req, res) => {
    const newUser = req.body;
    try {
        const createdUser = await user.create(newUser);
        res.status(201).json(createdUser);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const updatedUser = await user.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedUser) return res.status(404).json({ error: "User not found" });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await user.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};