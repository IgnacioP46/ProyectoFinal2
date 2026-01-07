import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios"; 
import { useNavigate } from "react-router-dom";
import { Package, User, LogOut } from 'lucide-react';

const styles = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#0b141a",
        color: "#e9edef",
        fontFamily: "'Segoe UI', sans-serif",
        padding: "40px 10%",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px",
        borderBottom: "1px solid #2a3942",
        paddingBottom: "20px",
    },
    title: { fontSize: "2.5rem", fontWeight: "800", margin: 0 },
    userCard: {
        backgroundColor: "#202c33",
        padding: "20px",
        borderRadius: "15px",
        marginBottom: "40px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        border: "1px solid #2a3942",
    },
    avatar: {
        width: "60px",
        height: "60px",
        backgroundColor: "#00a884",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#111b21",
    },
    orderCard: {
        backgroundColor: "#111b21",
        borderRadius: "10px",
        padding: "20px",
        marginBottom: "15px",
        borderLeft: "5px solid #00a884",
    },
    orderHeader: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
        fontSize: "0.9rem",
        color: "#8696a0",
    },
    logoutBtn: {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        color: "#ef4444",
        border: "1px solid #ef4444",
        padding: "10px 20px",
        borderRadius: "8px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontWeight: "bold",
    }
};

export default function Profile() {
    const { user, logout } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) { navigate("/login"); return; }
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            // Ajusta aquí si tu usuario usa '_id' o 'id'
            const userId = user.id || user._id;
            const { data } = await api.get(`/orders/user/${userId}`);
            setOrders(data);
        } catch (error) { console.error("Error pedidos", error); }
    };

    if (!user) return null;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Mi Perfil</h1>
                <button onClick={() => { logout(); navigate("/"); }} style={styles.logoutBtn}>
                    <LogOut size={18} /> Cerrar Sesión
                </button>
            </div>

            <div style={styles.userCard}>
                <div style={styles.avatar}><User size={30}/></div>
                <div>
                    <h2 style={{margin: "0 0 5px 0", fontSize: "1.5rem"}}>{user.name}</h2>
                    <p style={{margin: 0, color: "#8696a0"}}>{user.email}</p>
                </div>
            </div>

            <h3 style={{marginBottom: "20px", color: "#00a884"}}> <Package style={{marginBottom: "-5px"}}/> Historial de Pedidos</h3>
            
            {orders.length === 0 ? (
                <p style={{color: "#8696a0"}}>Aún no has realizado ninguna compra.</p>
            ) : (
                orders.map((order) => (
                    <div key={order._id} style={styles.orderCard}>
                        <div style={styles.orderHeader}>
                            <span>Pedido #{order._id.slice(-6).toUpperCase()}</span>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div style={{marginBottom: "10px"}}>
                            {order.items.map((item, i) => (
                                <div key={i} style={{display: "flex", justifyContent: "space-between", marginBottom: "5px"}}>
                                    <span>{item.title} <span style={{color: "#8696a0"}}>x{item.quantity}</span></span>
                                    <span>{(item.price * item.quantity).toFixed(2)} €</span>
                                </div>
                            ))}
                        </div>
                        <div style={{textAlign: "right", fontSize: "1.2rem", fontWeight: "bold", color: "#e9edef", borderTop: "1px solid #2a3942", paddingTop: "10px"}}>
                            Total: {order.total_price?.toFixed(2)} €
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}