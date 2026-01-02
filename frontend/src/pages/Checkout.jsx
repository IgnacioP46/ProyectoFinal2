import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CreditCard, ShieldCheck, MapPin } from 'lucide-react';
import api from "../api/axios";

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0b141a",
    color: "#e9edef",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    backgroundColor: "#202c33",
    padding: "40px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "600px",
    border: "1px solid #2a3942",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
  },
  title: { fontSize: "2rem", marginBottom: "30px", borderBottom: "1px solid #2a3942", paddingBottom: "15px" },
  summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: "15px", fontSize: "1.1rem" },
  totalRow: { display: "flex", justifyContent: "space-between", marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #2a3942", fontSize: "1.5rem", fontWeight: "bold", color: "#00a884" },
  payBtn: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#00a884",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  }
};

export default function Checkout() {
  const { cart, total, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cart.length === 0) navigate("/catalogo");
  }, [cart, navigate]);

  const handleFinalize = async () => {
    setLoading(true);
    try {
      // Aquí iría la lógica real de Stripe/PayPal
      const orderPayload = {
          items: cart,
          total: total,
          user_id: user ? (user.id || user._id) : null,
          guest_data: user ? null : { name: "Invitado desde Checkout" } // Simplificado para el ejemplo
      };
      
      await api.post("/orders", orderPayload);
      
      setTimeout(() => {
        alert("¡Pago procesado correctamente! Gracias por tu música.");
        clearCart();
        navigate("/profile");
      }, 1500);
    } catch (err) {
      alert("Error al procesar el pago.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Confirmar Pago</h1>
        
        <div style={{marginBottom: "30px"}}>
            <h3 style={{color: "#8696a0", marginBottom: "10px", fontSize: "0.9rem", textTransform: "uppercase"}}>Dirección de Envío</h3>
            <div style={{display: "flex", alignItems: "center", gap: "10px", color: "#e9edef"}}>
                <MapPin size={20} color="#00a884"/>
                <span>{user ? user.address?.street || "Calle Principal 123, Madrid" : "Dirección introducida anteriormente"}</span>
            </div>
        </div>

        <h3 style={{color: "#8696a0", marginBottom: "15px", fontSize: "0.9rem", textTransform: "uppercase"}}>Resumen</h3>
        {cart.map(item => (
            <div key={item._id} style={styles.summaryRow}>
                <span>{item.title} <span style={{color: "#8696a0"}}>x{item.qty}</span></span>
                <span>{(item.price * item.qty).toFixed(2)} €</span>
            </div>
        ))}
        
        <div style={styles.totalRow}>
            <span>Total a pagar</span>
            <span>{total.toFixed(2)} €</span>
        </div>

        <button 
            onClick={handleFinalize} 
            style={{...styles.payBtn, opacity: loading ? 0.7 : 1}} 
            disabled={loading}
        >
            {loading ? "Procesando..." : <><CreditCard /> Pagar {total.toFixed(2)} €</>}
        </button>

        <p style={{textAlign: "center", marginTop: "20px", color: "#8696a0", fontSize: "0.8rem", display: "flex", justifyContent: "center", gap: "5px"}}>
            <ShieldCheck size={14}/> Pagos 100% seguros y encriptados.
        </p>
      </div>
    </div>
  );
}