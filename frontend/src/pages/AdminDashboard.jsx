import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { 
    Plus, Trash2, Edit, Save, X, Users, Disc, Shield, ShieldOff 
} from "lucide-react";
import '../index.css'; 

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("vinyls"); // 'vinyls' | 'users'
    
    // --- ESTADOS VINILOS ---
    const [vinyls, setVinyls] = useState([]);
    
    // Estado para controlar si mostramos el formulario
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    
    // Formulario (SIN SKU)
    const initialVinylState = { 
        title: "", artist_name: "", price_eur: "", 
        stock: "", cover_image: "", 
        year: "", genre: "" 
    };
    const [formData, setFormData] = useState(initialVinylState);

    // --- ESTADOS USUARIOS ---
    const [usersList, setUsersList] = useState([]);

    // --- CARGA DE DATOS ---
    const fetchData = async () => {
        try {
            if (activeTab === "vinyls") {
                const res = await api.get("/vinyls");
                setVinyls(res.data);
            } else {
                const res = await api.get("/users");
                setUsersList(res.data);
            }
        } catch (error) { console.error(error); }
    };

    useEffect(() => { fetchData(); }, [activeTab]);

    // --- HANDLERS VINILOS ---
    const handleVinylChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Al pulsar "Añadir Nuevo"
    const handleAddNew = () => {
        setFormData(initialVinylState);
        setIsEditing(false);
        setEditId(null);
        setShowForm(true); // Mostramos formulario
    };

    // Al pulsar "Editar"
    const handleEditVinyl = (vinyl) => {
        setFormData({
            title: vinyl.title,
            artist_name: vinyl.artist_name,
            price_eur: vinyl.price_eur,
            stock: vinyl.stock,
            cover_image: vinyl.cover_image || "",
            year: vinyl.year || "",
            genre: vinyl.genre || ""
        });
        setEditId(vinyl._id);
        setIsEditing(true);
        setShowForm(true); // Mostramos formulario
        // Scroll suave hacia arriba
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setFormData(initialVinylState);
        setIsEditing(false);
    };

    const handleSubmitVinyl = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/vinyls/${editId}`, formData);
            } else {
                await api.post("/vinyls", formData);
            }
            fetchData();
            setShowForm(false); // Ocultamos formulario al terminar
        } catch (error) { alert("Error al guardar: " + error.message); }
    };

    const handleDeleteVinyl = async (id) => {
        if(!window.confirm("¿Borrar disco?")) return;
        try { await api.delete(`/vinyls/${id}`); fetchData(); } catch (e) { console.error(e); }
    };

    // --- HANDLERS USUARIOS ---
    const toggleUserRole = async (userId, currentRole) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        if(!window.confirm(`¿Cambiar rol a ${newRole}?`)) return;
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            fetchData();
        } catch (error) { alert("Error al cambiar rol"); }
    };

    if (!user || user.role !== 'admin') return <div className="p-10 text-white">Acceso Denegado</div>;

    return (
        <div className="admin-container">
            <h1 style={{fontSize: "2rem", marginBottom: "20px", fontWeight: "800"}}>Panel de Control</h1>

            {/* --- PESTAÑAS --- */}
            <div style={{display: "flex", gap: "20px", marginBottom: "30px", borderBottom: "1px solid #2a3942"}}>
                <button 
                    onClick={() => setActiveTab("vinyls")}
                    style={{
                        padding: "10px 20px", background: "none", border: "none", cursor: "pointer",
                        borderBottom: activeTab === "vinyls" ? "3px solid #00a884" : "3px solid transparent",
                        color: activeTab === "vinyls" ? "#00a884" : "#8696a0", fontWeight: "bold",
                        display: "flex", gap: "8px"
                    }}
                >
                    <Disc size={20}/> Vinilos
                </button>
                <button 
                    onClick={() => setActiveTab("users")}
                    style={{
                        padding: "10px 20px", background: "none", border: "none", cursor: "pointer",
                        borderBottom: activeTab === "users" ? "3px solid #00a884" : "3px solid transparent",
                        color: activeTab === "users" ? "#00a884" : "#8696a0", fontWeight: "bold",
                        display: "flex", gap: "8px"
                    }}
                >
                    <Users size={20}/> Usuarios
                </button>
            </div>

            {/* ==================== PESTAÑA VINILOS ==================== */}
            {activeTab === "vinyls" && (
                <>
                    {/* BOTÓN AÑADIR (Solo visible si el formulario está cerrado) */}
                    {!showForm && (
                        <button 
                            onClick={handleAddNew}
                            style={{
                                backgroundColor: "#00a884", color: "white", padding: "12px 24px", 
                                borderRadius: "8px", border: "none", cursor: "pointer", 
                                fontWeight: "bold", display: "flex", alignItems: "center", gap: "10px",
                                marginBottom: "30px", fontSize: "1rem"
                            }}
                        >
                            <Plus size={24} /> Añadir Nuevo Vinilo
                        </button>
                    )}

                    {/* FORMULARIO (Desplegable) */}
                    {showForm && (
                        <div className="admin-card animate-fade-in-up" style={{ padding: "30px", marginBottom: "40px", border: "1px solid #00a884" }}>
                            <h2 style={{marginBottom: "20px", display:"flex", alignItems:"center", gap:"10px", color: "#00a884"}}>
                                {isEditing ? <Edit/> : <Plus/>} 
                                {isEditing ? "Editar Vinilo" : "Añadir Nuevo Vinilo"}
                            </h2>
                            
                            <form onSubmit={handleSubmitVinyl} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                                <input name="title" placeholder="Título del Álbum" value={formData.title} onChange={handleVinylChange} required className="input-dark" />
                                <input name="artist_name" placeholder="Artista" value={formData.artist_name} onChange={handleVinylChange} required className="input-dark" />
                                
                                <input name="year" type="number" placeholder="Año" value={formData.year} onChange={handleVinylChange} className="input-dark" />
                                <input name="genre" placeholder="Género" value={formData.genre} onChange={handleVinylChange} className="input-dark" />

                                <input name="price_eur" type="number" placeholder="Precio (€)" value={formData.price_eur} onChange={handleVinylChange} required className="input-dark" />
                                <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleVinylChange} required className="input-dark" />
                                
                                <input name="cover_image" placeholder="URL Imagen Portada" value={formData.cover_image} onChange={handleVinylChange} className="input-dark" />

                                <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px", marginTop: "10px" }}>
                                    <button type="submit" className="btn-action" style={{ backgroundColor: "#00a884", color: "white", padding: "10px 25px" }}>
                                        <Save size={18}/> Guardar
                                    </button>
                                    <button type="button" onClick={handleCancelForm} className="btn-action" style={{ backgroundColor: "#ef4444", color: "white", padding: "10px 25px" }}>
                                        <X size={18}/> Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* LISTA VINILOS (Responsive) */}
                    <div className="admin-card">
                        {/* Cabecera */}
                        <div className="admin-row-vinyl" style={{ backgroundColor: "#2a3942", fontWeight: "bold" }}>
                            <span>Img</span>
                            <span>Título</span>
                            <span className="hide-on-tablet">Artista</span>
                            <span className="hide-on-tablet">Precio</span>
                            <span style={{textAlign: "center"}}>Acciones</span>
                        </div>

                        {vinyls.map((v) => (
                            <div key={v._id} className="admin-row-vinyl">
                                {/* 1. Imagen */}
                                <img src={v.cover_image || "https://via.placeholder.com/50"} alt="cover" style={{ width: "50px", height: "50px", borderRadius: "5px", objectFit: "cover" }} />
                                
                                {/* 2. Título */}
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <span style={{ fontWeight: "bold" }}>{v.title}</span>
                                    {/* MÓVIL: Mostrar artista debajo del título porque la columna Artista se oculta */}
                                    <span style={{ fontSize: "0.8rem", color: "#8696a0" }} className="show-mobile-only">{v.artist_name}</span>
                                </div>
                                
                                {/* 3. Artista (Oculto en móvil) */}
                                <span className="hide-on-tablet" style={{ color: "#8696a0" }}>{v.artist_name}</span>
                                
                                {/* 4. Precio (Oculto en móvil) */}
                                <span className="hide-on-tablet">{v.price_eur} €</span>

                                {/* 5. Botones (Siempre visibles) */}
                                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                                    <button onClick={() => handleEditVinyl(v)} className="btn-action" style={{ background: "transparent", border: "1px solid #3b82f6", color: "#3b82f6" }}>
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDeleteVinyl(v._id)} className="btn-action" style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444" }}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ==================== PESTAÑA USUARIOS ==================== */}
            {activeTab === "users" && (
                <div className="admin-card">
                    <div className="admin-row-user" style={{ backgroundColor: "#2a3942", fontWeight: "bold" }}>
                        <span>Nombre</span>
                        <span>Email</span>
                        <span className="hide-on-tablet">Rol</span>
                        <span style={{textAlign: "right"}}>Gestión</span>
                    </div>

                    {usersList.map((u) => (
                        <div key={u._id} className="admin-row-user">
                            <span style={{fontWeight: "bold"}}>{u.name}</span>
                            <span style={{color: "#8696a0", overflow: "hidden", textOverflow: "ellipsis"}}>{u.email}</span>
                            
                            <span className="hide-on-tablet" style={{color: u.role === "admin" ? "#00a884" : "#e9edef"}}>
                                {u.role ? u.role.toUpperCase() : "USER"}
                            </span>

                            <div style={{textAlign: "right", display: "flex", justifyContent: "flex-end"}}>
                                <button 
                                    onClick={() => toggleUserRole(u._id, u.role)} 
                                    className="btn-action"
                                    style={{
                                        backgroundColor: u.role === "admin" ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)",
                                        color: u.role === "admin" ? "#ef4444" : "#3b82f6",
                                        border: `1px solid ${u.role === "admin" ? "#ef4444" : "#3b82f6"}`
                                    }}>
                                    {u.role === "admin" ? <><ShieldOff size={16}/> <span className="hide-on-tablet">Quitar Admin</span></> : <><Shield size={16}/> <span className="hide-on-tablet">Hacer Admin</span></>}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Pequeño hack para mostrar artista bajo titulo en movil */}
            <style>{`
                .show-mobile-only { display: none; }
                @media (max-width: 900px) {
                    .show-mobile-only { display: block; margin-top: 4px; }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;