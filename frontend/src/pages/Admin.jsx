import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";

const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#0b141a",
        color: "#e9edef",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "'Segoe UI', sans-serif",
    },
    card: {
        backgroundColor: "#202c33",
        padding: "40px",
        borderRadius: "20px",
        width: "100%",
        maxWidth: "600px",
        border: "1px solid #2a3942",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    },
    title: { textAlign: "center", marginBottom: "30px", fontSize: "2rem" },
    grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
    label: { display: "block", color: "#8696a0", marginBottom: "8px", fontSize: "0.9rem" },
    input: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#111b21",
        border: "1px solid #2a3942",
        borderRadius: "8px",
        color: "white",
        fontSize: "1rem",
        outline: "none",
        marginBottom: "20px",
    },
    btn: {
        width: "100%",
        padding: "15px",
        backgroundColor: "#00a884",
        color: "#fff",
        border: "none",
        borderRadius: "50px",
        fontSize: "1.1rem",
        fontWeight: "bold",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginTop: "10px",
    },
    backBtn: {
        background: "transparent",
        border: "none",
        color: "#8696a0",
        marginBottom: "20px",
        cursor: "pointer",
        display: "flex", alignItems: "center", gap: "5px"
    }
};

export default function Admin() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [form, setForm] = useState({
        title: "", artist_name: "", price_eur: "", stock: 10, 
        cover_image: "", genre: "", year: new Date().getFullYear(), 
        artist_code: "ART-GEN"
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') navigate("/");
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/vinyls", form);
            alert("¡Disco añadido correctamente!");
            navigate("/admin"); // Volver al dashboard
        } catch (error) {
            alert("Error al guardar el disco. Revisa los datos.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <button onClick={() => navigate("/admin")} style={styles.backBtn}><ArrowLeft size={18}/> Volver al panel</button>
                <h1 style={styles.title}>Añadir Nuevo Vinilo</h1>
                
                <form onSubmit={handleSubmit}>
                    <div style={styles.grid}>
                        <div>
                            <label style={styles.label}>Título del Álbum</label>
                            <input style={styles.input} required onChange={e => setForm({...form, title: e.target.value})} />
                        </div>
                        <div>
                            <label style={styles.label}>Artista</label>
                            <input style={styles.input} required onChange={e => setForm({...form, artist_name: e.target.value})} />
                        </div>
                    </div>

                    <div style={styles.grid}>
                        <div>
                            <label style={styles.label}>Precio (€)</label>
                            <input type="number" step="0.01" style={styles.input} required onChange={e => setForm({...form, price_eur: e.target.value})} />
                        </div>
                        <div>
                            <label style={styles.label}>Stock Inicial</label>
                            <input type="number" style={styles.input} required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
                        </div>
                    </div>

                    <label style={styles.label}>URL Portada (Imagen)</label>
                    <input style={styles.input} placeholder="https://..." onChange={e => setForm({...form, cover_image: e.target.value})} />

                    <div style={styles.grid}>
                         <div>
                            <label style={styles.label}>Género</label>
                            <input style={styles.input} onChange={e => setForm({...form, genre: e.target.value})} />
                        </div>
                        <div>
                            <label style={styles.label}>Año</label>
                            <input type="number" style={styles.input} value={form.year} onChange={e => setForm({...form, year: e.target.value})} />
                        </div>
                    </div>

                    <button type="submit" style={styles.btn}>
                        <Save /> Guardar en Catálogo
                    </button>
                </form>
            </div>
        </div>
    );
}