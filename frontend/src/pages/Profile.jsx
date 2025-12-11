import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios"; // Asegúrate de que api/axios.js existe
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { user, setUser, logout } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    // Redirigir si no hay usuario
    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        setFormData(user);
        fetchOrders();
    }, [user, navigate]);

    const fetchOrders = async () => {
        if (!user) return;
        try {
            // Pide los pedidos al backend
            const userId = user.id || user._id; // Manejo seguro del ID
            const { data } = await api.get(`/orders/user/${userId}`);
            setOrders(data);
        } catch (error) {
            console.error("Error al cargar pedidos:", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const userId = user.id || user._id;
            // Actualiza datos en backend
            const { data } = await api.put(`/auth/profile/${userId}`, formData);
            // Actualiza contexto global
            setUser({ ...user, ...data });
            setIsEditing(false);
            alert("Perfil actualizado correctamente");
        } catch (error) {
            alert("Error al actualizar el perfil");
            console.error(error);
        }
    };

    if (!user) return <div className="p-8 text-white">Cargando perfil...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 text-white">
            <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

            {/* Tarjeta de Datos Personales */}
            <div className="bg-[#1e1e1e] p-6 rounded-xl mb-8 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-purple-400">Datos Personales</h2>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-4 py-2 rounded font-bold transition ${isEditing ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-600 hover:bg-purple-700'}`}
                    >
                        {isEditing ? "Cancelar Edición" : "Editar Datos"}
                    </button>
                </div>

                {isEditing ? (
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                            <input
                                value={formData.name || ""}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-[#2a2a2a] border border-gray-600 rounded p-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Dirección (Calle)</label>
                            <input
                                value={formData.address?.street || ""}
                                onChange={e => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                                className="w-full bg-[#2a2a2a] border border-gray-600 rounded p-2 text-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Ciudad</label>
                                <input
                                    value={formData.address?.city || ""}
                                    onChange={e => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded p-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Código Postal</label>
                                <input
                                    value={formData.address?.zip || ""}
                                    onChange={e => setFormData({ ...formData, address: { ...formData.address, zip: e.target.value } })}
                                    className="w-full bg-[#2a2a2a] border border-gray-600 rounded p-2 text-white"
                                />
                            </div>
                        </div>
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded mt-4">
                            Guardar Cambios
                        </button>
                    </form>
                ) : (
                    <div className="space-y-3">
                        <p><span className="text-gray-400">Nombre:</span> {user.name}</p>
                        <p><span className="text-gray-400">Email:</span> {user.email}</p>
                        <p><span className="text-gray-400">Dirección:</span> {user.address?.street ? `${user.address.street}, ${user.address.city}` : "Sin dirección configurada"}</p>
                    </div>
                )}
            </div>

            {/* Historial de Pedidos */}
            <h2 className="text-2xl font-bold mb-4">Historial de Compras</h2>
            {orders.length === 0 ? (
                <p className="text-gray-400 bg-[#1e1e1e] p-6 rounded-xl">Aún no has realizado ninguna compra.</p>
            ) : (
                <div className="grid gap-4">
                    {orders.map(order => (
                        <div key={order._id} className="bg-[#1e1e1e] p-4 rounded-xl border border-[#333]">
                            <div className="flex justify-between border-b border-[#333] pb-2 mb-2">
                                <span className="font-bold text-green-400">Pedido #{order._id.slice(-6)}</span>
                                <span className="text-gray-400 text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="space-y-1 mb-3">
                                {order.items.map((item, i) => (
                                    <div key={i} className="text-sm flex justify-between">
                                        <span>{item.title} <span className="text-gray-500">x{item.quantity}</span></span>
                                        <span>{(item.price * item.quantity).toFixed(2)} €</span>
                                    </div>
                                ))}
                            </div>
                            <div className="text-right font-bold text-xl pt-2 border-t border-[#333]">
                                Total: {order.total_price?.toFixed(2)} €
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={() => { logout(); navigate("/"); }}
                className="mt-8 bg-red-900/50 hover:bg-red-800 text-red-200 px-4 py-2 rounded border border-red-800"
            >
                Cerrar Sesión
            </button>
        </div>
    );
}