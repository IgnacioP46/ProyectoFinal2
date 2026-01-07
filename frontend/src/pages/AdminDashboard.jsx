import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { 
    Plus, Trash2, Edit, Save, X, Users, Disc, Shield, ShieldOff, RefreshCw 
} from "lucide-react";

const styles = {
    container: { minHeight: "100vh", backgroundColor: "#0b141a", color: "#e9edef", padding: "40px 5%", fontFamily: "'Segoe UI', sans-serif" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
    title: { fontSize: "2rem", fontWeight: "800" },
    tabsContainer: { display: "flex", gap: "20px", marginBottom: "30px", borderBottom: "1px solid #2a3942" },
    tab: (active) => ({ padding: "10px 20px", cursor: "pointer", borderBottom: active ? "3px solid #00a884" : "3px solid transparent", color: active ? "#00a884" : "#8696a0", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }),
    btnGreen: { backgroundColor: "#00a884", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" },
    btnRed: { backgroundColor: "#ef4444", color: "white", padding: "8px", borderRadius: "5px", border: "none", cursor: "pointer" },
    btnBlue: { backgroundColor: "#3b82f6", color: "white", padding: "8px", borderRadius: "5px", border: "none", cursor: "pointer", marginRight: "10px" },
    tableContainer: { backgroundColor: "#202c33", borderRadius: "15px", overflowX: "auto", border: "1px solid #2a3942" },
    row: { display: "grid", gridTemplateColumns: "60px 2fr 1.5fr 1fr 1fr 1fr", padding: "15px", borderBottom: "1px solid #2a3942", alignItems: "center", minWidth: "800px" },
    headerRow: { fontWeight: "bold", color: "#8696a0", backgroundColor: "#111b21" },
    img: { width: "50px", height: "50px", borderRadius: "5px", objectFit: "cover" },
    editForm: { backgroundColor: "#202c33", padding: "30px", borderRadius: "15px", border: "1px solid #00a884", marginBottom: "30px" },
    inputGroup: { marginBottom: "15px" },
    label: { display: "block", color: "#8696a0", marginBottom: "5px" },
    input: { width: "100%", padding: "10px", backgroundColor: "#111b21", border: "1px solid #2a3942", borderRadius: "8px", color: "white" },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }
};

export default function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState("products");
    const [vinyls, setVinyls] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchVinyls();
        fetchUsers();
    }, []);

    const fetchVinyls = async () => {
        try {
            const res = await api.get("/vinyls");
            setVinyls(res.data);
        } catch (error) { console.error("Error cargando vinilos", error); }
    };

    const fetchUsers = async () => {
        try {
            console.log("Pidiendo usuarios...");
            const res = await api.get("/users");
            console.log("Usuarios recibidos:", res.data);
            setUsers(res.data);
        } catch (error) { 
            console.error("Error cargando usuarios:", error.response || error); 
        }
    };

    const handleDeleteVinyl = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este disco?")) return;
        try {
            await api.delete(`/vinyls/${id}`);
            setVinyls(vinyls.filter(v => v._id !== id));
        } catch (error) { alert("Error al eliminar"); }
    };

    const handleUpdateVinyl = async (e) => {
        e.preventDefault();
        
        // 1. Validar ID
        if (!editingProduct._id) {
            alert("Error grave: El producto no tiene ID. Recarga la página.");
            return;
        }

        // 2. Preparar datos (sin _id y convirtiendo números)
        const { _id, ...dataToSend } = editingProduct;
        const cleanData = {
            ...dataToSend,
            price_eur: Number(dataToSend.price_eur),
            stock: Number(dataToSend.stock)
        };

        try {
            console.log(`📡 Enviando PUT a /vinyls/${_id}`, cleanData);
            
            // 3. Petición
            await api.put(`/vinyls/${_id}`, cleanData);
            
            alert("¡Cambios guardados con éxito!");
            
            // 4. Limpieza y Recarga
            setEditingProduct(null);
            fetchVinyls(); 

        } catch (error) {
            console.error("❌ Error en la petición PUT:", error);
            // Mostrar mensaje detallado si el servidor lo envía
            const serverMsg = error.response?.data?.message || error.message;
            alert(`Error al guardar: ${serverMsg}`);
        }
    };

    const toggleUserRole = async (userId, currentRole) => {
        if (!window.confirm(`¿Cambiar permisos de usuario?`)) return;
        try {
            const newRole = currentRole === "admin" ? "user" : "admin";
            await api.put(`/users/${userId}/role`, { role: newRole });
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch (error) { alert("Error al cambiar permisos"); }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Panel de Administración</h1>
                {activeTab === "products" && !editingProduct && (
                    <button onClick={() => navigate("/admin/new")} style={styles.btnGreen}>
                        <Plus size={20}/> Nuevo Disco
                    </button>
                )}
            </div>

            <div style={styles.tabsContainer}>
                <div style={styles.tab(activeTab === "products")} onClick={() => setActiveTab("products")}>
                    <Disc size={20}/> Catálogo
                </div>
                <div style={styles.tab(activeTab === "users")} onClick={() => setActiveTab("users")}>
                    <Users size={20}/> Usuarios
                </div>
            </div>

            {/* --- SECCIÓN PRODUCTOS --- */}
            {activeTab === "products" && (
                <>
                    {/* FORMULARIO DE EDICIÓN */}
                    {editingProduct ? (
                        <div style={styles.editForm}>
                            <div style={{display: "flex", justifyContent: "space-between", marginBottom: "20px"}}>
                                <h2>Editando: {editingProduct.title}</h2>
                                <button onClick={() => setEditingProduct(null)} style={{background:"none", border:"none", color:"white", cursor:"pointer"}}><X/></button>
                            </div>
                            
                            <form onSubmit={handleUpdateVinyl}>
                                <div style={styles.grid2}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Título</label>
                                        <input style={styles.input} 
                                            value={editingProduct.title || ""} 
                                            onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Artista</label>
                                        <input style={styles.input} 
                                            value={editingProduct.artist_name || ""} 
                                            onChange={e => setEditingProduct({...editingProduct, artist_name: e.target.value})} />
                                    </div>
                                </div>
                                <div style={styles.grid2}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Precio (€)</label>
                                        <input type="number" style={styles.input} 
                                            value={editingProduct.price_eur || 0} 
                                            onChange={e => setEditingProduct({...editingProduct, price_eur: e.target.value})} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Stock</label>
                                        <input type="number" style={styles.input} 
                                            value={editingProduct.stock || 0} 
                                            onChange={e => setEditingProduct({...editingProduct, stock: e.target.value})} />
                                    </div>
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>URL Imagen</label>
                                    <input style={styles.input} 
                                        value={editingProduct.cover_image || ""} 
                                        onChange={e => setEditingProduct({...editingProduct, cover_image: e.target.value})} />
                                </div>
                                <button type="submit" style={styles.btnGreen}>
                                    <Save size={18}/> Guardar Cambios
                                </button>
                            </form>
                        </div>
                    ) : (
                        /* TABLA DE PRODUCTOS */
                        <div style={styles.tableContainer}>
                            <div style={{...styles.row, ...styles.headerRow}}>
                                <span>Img</span>
                                <span>Título</span>
                                <span>Artista</span>
                                <span>Precio</span>
                                <span>Stock</span>
                                <span>Acciones</span>
                            </div>
                            {vinyls.map((v) => (
                                <div key={v._id} style={styles.row}>
                                    <img src={v.cover_image} alt="" style={styles.img} />
                                    <span style={{fontWeight: "bold"}}>{v.title}</span>
                                    <span style={{color: "#8696a0"}}>{v.artist_name}</span>
                                    <span style={{color: "#00a884"}}>{v.price_eur} €</span>
                                    <span style={{color: v.stock < 5 ? "#ef4444" : "#e9edef"}}>{v.stock} u.</span>
                                    <div style={{display: "flex"}}>
                                        <button onClick={() => setEditingProduct(v)} style={styles.btnBlue}><Edit size={18}/></button>
                                        <button onClick={() => handleDeleteVinyl(v._id)} style={styles.btnRed}><Trash2 size={18}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* --- SECCIÓN USUARIOS --- */}
            {activeTab === "users" && (
                <div>
                     <button onClick={fetchUsers} style={{marginBottom: "20px", ...styles.btnBlue}}>
                        <RefreshCw size={16}/> Recargar Usuarios
                    </button>

                    <div style={styles.tableContainer}>
                        <div style={{...styles.row, gridTemplateColumns: "1fr 1fr 1fr 1fr", ...styles.headerRow}}>
                            <span>Nombre</span>
                            <span>Email</span>
                            <span>Rol</span>
                            <span>Permisos</span>
                        </div>
                        
                        {users.length === 0 && (
                            <div style={{padding: "20px", textAlign: "center", color: "#ef4444"}}>
                                No hay usuarios o hay un error de conexión. Revisa la consola (F12).
                            </div>
                        )}

                        {users.map((u) => (
                            <div key={u._id} style={{...styles.row, gridTemplateColumns: "1fr 1fr 1fr 1fr"}}>
                                <span style={{fontWeight: "bold"}}>{u.name}</span>
                                <span style={{color: "#8696a0"}}>{u.email}</span>
                                <span style={{color: u.role === "admin" ? "#00a884" : "#e9edef", fontWeight: "bold"}}>
                                    {u.role ? u.role.toUpperCase() : "USER"}
                                </span>
                                <button 
                                    onClick={() => toggleUserRole(u._id, u.role)} 
                                    style={{
                                        ...styles.btnBlue, 
                                        backgroundColor: u.role === "admin" ? "#ef4444" : "#3b82f6",
                                        display: "flex", gap: "10px", width: "fit-content", padding: "8px 15px"
                                    }}>
                                    {u.role === "admin" ? <><ShieldOff size={16}/> Quitar Admin</> : <><Shield size={16}/> Hacer Admin</>}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}