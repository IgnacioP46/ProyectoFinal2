import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Edit, Package } from "lucide-react";

const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#0b141a",
        color: "#e9edef",
        padding: "40px",
        fontFamily: "'Segoe UI', sans-serif",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px",
    },
    title: { fontSize: "2.5rem", fontWeight: "800", color: "#e9edef" },
    addBtn: {
        backgroundColor: "#00a884",
        color: "#fff",
        border: "none",
        padding: "12px 24px",
        borderRadius: "8px",
        fontWeight: "bold",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    tableContainer: {
        backgroundColor: "#202c33",
        borderRadius: "15px",
        overflow: "hidden",
        border: "1px solid #2a3942",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    },
    tableHeader: {
        display: "grid",
        gridTemplateColumns: "80px 2fr 1.5fr 1fr 1fr 100px",
        padding: "15px 20px",
        backgroundColor: "#111b21",
        color: "#8696a0",
        fontWeight: "bold",
        fontSize: "0.9rem",
    },
    row: {
        display: "grid",
        gridTemplateColumns: "80px 2fr 1.5fr 1fr 1fr 100px",
        padding: "15px 20px",
        borderBottom: "1px solid #2a3942",
        alignItems: "center",
    },
    img: { width: "50px", height: "50px", borderRadius: "5px", objectFit: "cover" },
    actionBtn: { background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "5px" }
};

export default function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [vinyls, setVinyls] = useState([]);

    useEffect(() => {
        if (!user || user.role !== "admin") { navigate("/"); return; }
        loadVinyls();
    }, [user]);

    const loadVinyls = async () => {
        const { data } = await api.get("/vinyls");
        setVinyls(data);
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que quieres eliminar este disco?")) {
            await api.delete(`/vinyls/${id}`);
            loadVinyls();
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Inventario</h1>
                <button onClick={() => navigate("/admin/new")} style={styles.addBtn}>
                    <Plus size={20}/> Nuevo Disco
                </button>
            </div>

            <div style={styles.tableContainer}>
                <div style={styles.tableHeader}>
                    <span>Imagen</span>
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
                        <span style={{color: "#00a884", fontWeight: "bold"}}>{v.price_eur} €</span>
                        <span style={{color: v.stock < 5 ? "#ef4444" : "#e9edef"}}>{v.stock} u.</span>
                        <button onClick={() => handleDelete(v._id)} style={styles.actionBtn}>
                            <Trash2 size={20}/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}