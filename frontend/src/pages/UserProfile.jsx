import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { User, Package, MapPin, Calendar, LogOut, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- ESTILOS EN JAVASCRIPT ---
const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#0b141a",
        color: "#e9edef",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', sans-serif",
        display: "flex",
        justifyContent: "center",
        gap: "40px",
        flexWrap: "wrap"
    },
    // Columna Izquierda: Tarjeta Usuario
    profileCard: {
        backgroundColor: "#202c33",
        padding: "30px",
        borderRadius: "20px",
        width: "100%",
        maxWidth: "350px",
        height: "fit-content",
        border: "1px solid #2a3942",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        textAlign: "center"
    },
    avatar: {
        width: "100px", height: "100px", borderRadius: "50%",
        backgroundColor: "#00a884", color: "white", display: "flex",
        alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto"
    },
    roleBadge: {
        backgroundColor: "#2a3942", color: "#00a884", 
        padding: "4px 12px", borderRadius: "15px", fontSize: "0.8rem", 
        textTransform: "uppercase", display: "inline-block", marginBottom: "20px"
    },
    userInfoItem: {
        display: "flex", alignItems: "center", gap: "10px",
        color: "#8696a0", marginBottom: "15px", fontSize: "0.95rem",
        textAlign: "left", padding: "0 10px"
    },
    logoutBtn: {
        marginTop: "20px", width: "100%", padding: "12px",
        backgroundColor: "#ef4444", color: "white", border: "none",
        borderRadius: "10px", cursor: "pointer", display: "flex",
        alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: "bold"
    },
    
    // Columna Derecha: Historial
    historySection: {
        flex: 1,
        maxWidth: "800px",
        minWidth: "300px"
    },
    sectionTitle: { 
        fontSize: "1.8rem", marginBottom: "20px", color: "#e9edef", 
        borderBottom: "2px solid #00a884", display: "inline-block", paddingBottom: "5px" 
    },
    orderCard: {
        backgroundColor: "#202c33",
        borderRadius: "15px",
        padding: "20px",
        marginBottom: "20px",
        border: "1px solid #2a3942"
    },
    orderHeader: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid #2a3942", paddingBottom: "15px", marginBottom: "15px"
    },
    statusBadge: (status) => ({
        padding: "5px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold",
        backgroundColor: status === "completed" ? "rgba(0, 168, 132, 0.2)" : "rgba(255, 193, 7, 0.2)",
        color: status === "completed" ? "#00a884" : "#ffc107"
    }),
    itemRow: {
        display: "flex", alignItems: "center", gap: "15px", marginBottom: "10px"
    },
    vinylThumb: { width: "50px", height: "50px", borderRadius: "5px", objectFit: "cover" }
};

export default function UserProfile() {
    const { user, logout } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 1. SEGURIDAD: Si no hay usuario, mandar al Home
    useEffect(() => {
        if (!user) {
            navigate("/"); 
        }
    }, [user, navigate]);

    // 2. CARGAR PEDIDOS: Solo si hay usuario
    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get("/orders/my-orders");
            setOrders(data);
        } catch (error) {
            console.error("Error cargando pedidos", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Renderizado condicional para evitar errores mientras redirige
    if (!user) return <div style={{...styles.container, alignItems: "center"}}>Cargando perfil...</div>;

    return (
        <div style={styles.container}>
            
            {/* --- TARJETA DE PERFIL (IZQUIERDA) --- */}
            <div style={styles.profileCard}>
                <div style={styles.avatar}>
                    <User size={50} />
                </div>
                <h2 style={{marginBottom: "5px"}}>{user.name}</h2>
                <span style={styles.roleBadge}>
                    {user.role === 'admin' ? 'Administrador' : 'Cliente VIP'}
                </span>
                
                <hr style={{borderColor: "#2a3942", margin: "20px 0"}}/>

                <div style={styles.userInfoItem}>
                    <div style={{minWidth: "20px"}}><Mail size={18}/></div>
                    {user.email}
                </div>
                
                <div style={styles.userInfoItem}>
                    <div style={{minWidth: "20px"}}><MapPin size={18}/></div>
                    <span>
                        {user.address ? (
                            <>
                                {user.address.street} {user.address.number}<br/>
                                {user.address.city}, {user.address.zipCode}
                            </>
                        ) : (
                            "Sin dirección guardada"
                        )}
                    </span>
                </div>

                <button onClick={handleLogout} style={styles.logoutBtn}>
                    <LogOut size={18}/> Cerrar Sesión
                </button>
            </div>

            {/* --- HISTORIAL DE COMPRAS (DERECHA) --- */}
            <div style={styles.historySection}>
                <h1 style={styles.sectionTitle}>Historial de Pedidos</h1>

                {loading ? (
                    <p>Cargando historial...</p>
                ) : orders.length === 0 ? (
                    <div style={{...styles.orderCard, textAlign: "center", padding: "40px"}}>
                        <Package size={48} color="#8696a0" style={{marginBottom: "20px"}}/>
                        <p style={{color: "#8696a0"}}>Aún no has realizado ninguna compra.</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} style={styles.orderCard}>
                            <div style={styles.orderHeader}>
                                <div>
                                    <span style={{color: "#8696a0", fontSize: "0.9rem"}}>
                                        <Calendar size={14} style={{marginRight: "5px", verticalAlign: "middle"}}/> 
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                    <div style={{fontWeight: "bold", marginTop: "5px"}}>ID: {order._id.slice(-6).toUpperCase()}</div>
                                </div>
                                <div style={{textAlign: "right"}}>
                                    <div style={styles.statusBadge(order.status)}>
                                        {order.status === "completed" ? "Entregado" : order.status}
                                    </div>
                                    <div style={{marginTop: "5px", fontWeight: "bold", color: "#e9edef"}}>
                                        Total: {order.total_price.toFixed(2)} €
                                    </div>
                                </div>
                            </div>

                            <div>
                                {order.items.map((item, index) => (
                                    <div key={index} style={styles.itemRow}>
                                        <img 
                                            src={item.vinyl?.cover_image || "https://via.placeholder.com/50"} 
                                            alt="Cover" 
                                            style={styles.vinylThumb}
                                        />
                                        <div>
                                            <div style={{fontWeight: "bold"}}>{item.vinyl?.title || "Producto eliminado"}</div>
                                            <div style={{color: "#8696a0", fontSize: "0.9rem"}}>
                                                {item.quantity} x {item.price_at_purchase} €
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}