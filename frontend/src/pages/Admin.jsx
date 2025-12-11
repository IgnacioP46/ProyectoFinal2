import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Admin() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [vinyls, setVinyls] = useState([]);
    const [form, setForm] = useState({ title: "", artist_name: "", price: 0, cover_image: "" });

    useEffect(() => {
        if (!user || user.role !== 'admin') navigate("/");
        loadVinyls();
    }, [user]);

    const loadVinyls = async () => {
        const res = await axios.get("http://localhost:3000/api/vinyls");
        setVinyls(res.data);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:3000/api/vinyls", form);
        loadVinyls();
        setForm({ title: "", artist_name: "", price: 0, cover_image: "" }); // Reset
    };

    const handleDelete = async (id) => {
        if (confirm("¿Borrar?")) {
            await axios.delete(`http://localhost:3000/api/vinyls/${id}`);
            loadVinyls();
        }
    };

    return (
        <div className="admin-panel">
            <h2>Panel de Administración</h2>

            <form onSubmit={handleSave} className="admin-form">
                <input placeholder="Título" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                <input placeholder="Artista" value={form.artist_name} onChange={e => setForm({ ...form, artist_name: e.target.value })} required />
                <input placeholder="Precio" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                <input placeholder="URL Imagen" value={form.cover_image} onChange={e => setForm({ ...form, cover_image: e.target.value })} />
                <button type="submit">Subir Nuevo Vinilo</button>
            </form>

            <div className="list">
                {vinyls.map(v => (
                    <div key={v._id} className="admin-row">
                        <span>{v.title}</span>
                        <button onClick={() => handleDelete(v._id)} className="delete-btn">Borrar</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
