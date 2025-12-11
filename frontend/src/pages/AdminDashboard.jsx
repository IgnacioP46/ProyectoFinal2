import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [vinyls, setVinyls] = useState([]);
    // Estado para el formulario de nuevo vinilo
    const [form, setForm] = useState({
        title: "", artist_name: "", price_eur: "", cover_image: "", stock: 10
    });

    useEffect(() => {
        // Seguridad básica en frontend: si no es admin, fuera.
        if (!user || user.role !== "admin") {
            navigate("/");
            return;
        }
        loadVinyls();
    }, [user]);

    const loadVinyls = async () => {
        const { data } = await api.get("/vinyls");
        setVinyls(data);
    };

    const handleDelete = async (id) => {
        if (confirm("¿Estás seguro de borrar este vinilo para siempre?")) {
            try {
                await api.delete(`/vinyls/${id}`);
                loadVinyls(); // Recargar lista
            } catch (err) { alert("Error al borrar"); }
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/vinyls", form);
            alert("Vinilo añadido correctamente");
            setForm({ title: "", artist_name: "", price_eur: "", cover_image: "", stock: 10 });
            loadVinyls();
        } catch (err) { alert("Error al crear. Revisa los datos."); }
    };

    return (
        <div className="container mx-auto p-6 text-white">
            <h1 className="text-3xl font-bold mb-8 text-yellow-500">Panel de Administración</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* COLUMNA 1: Formulario de Subida */}
                <div className="bg-neutral-800 p-6 rounded-lg h-fit">
                    <h2 className="text-xl font-bold mb-4">Subir Nuevo Vinilo</h2>
                    <form onSubmit={handleCreate} className="flex flex-col gap-3">
                        <input
                            placeholder="Título del álbum"
                            className="p-2 bg-neutral-700 rounded text-white"
                            value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                        />
                        <input
                            placeholder="Artista / Banda"
                            className="p-2 bg-neutral-700 rounded text-white"
                            value={form.artist_name} onChange={e => setForm({ ...form, artist_name: e.target.value })} required
                        />
                        <input
                            type="number" placeholder="Precio (€)"
                            className="p-2 bg-neutral-700 rounded text-white"
                            value={form.price_eur} onChange={e => setForm({ ...form, price_eur: e.target.value })} required
                        />
                        <input
                            placeholder="URL de la Portada"
                            className="p-2 bg-neutral-700 rounded text-white"
                            value={form.cover_image} onChange={e => setForm({ ...form, cover_image: e.target.value })}
                        />
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded mt-2">
                            Añadir al Catálogo
                        </button>
                    </form>
                </div>

                {/* COLUMNA 2 y 3: Lista de Vinilos */}
                <div className="md:col-span-2 bg-neutral-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Inventario Actual ({vinyls.length})</h2>
                    <div className="overflow-y-auto max-h-[600px] pr-2 space-y-2">
                        {vinyls.map(v => (
                            <div key={v._id} className="flex justify-between items-center bg-neutral-900 p-3 rounded border border-neutral-700">
                                <div className="flex items-center gap-3">
                                    <img src={v.cover_image || "https://via.placeholder.com/40"} className="w-10 h-10 rounded object-cover" />
                                    <div>
                                        <p className="font-bold">{v.title}</p>
                                        <p className="text-xs text-gray-400">{v.artist_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-purple-400 font-bold">{v.price_eur}€</span>
                                    <button
                                        onClick={() => handleDelete(v._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Borrar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}