import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext"; 
import { Trash2, ArrowLeft, ShoppingBag, CreditCard, User, MapPin, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

// --- ESTILOS ---
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0b141a",
    color: "#e9edef",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "40px 5%",
  },
  header: { textAlign: "center", marginBottom: "30px" },
  title: { fontSize: "2.5rem", fontWeight: "800", marginBottom: "10px" },
  
  cartGrid: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr", 
    gap: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  
  itemsColumn: { display: "flex", flexDirection: "column", gap: "20px" },
  
  itemCard: {
    display: "flex",
    backgroundColor: "#202c33",
    borderRadius: "15px",
    padding: "15px",
    alignItems: "center",
    gap: "20px",
    border: "1px solid #2a3942"
  },
  img: { width: "80px", height: "80px", borderRadius: "10px", objectFit: "cover" },
  info: { flex: 1 },
  itemTitle: { fontWeight: "bold", fontSize: "1.1rem" },
  itemArtist: { color: "#8696a0", fontSize: "0.9rem" },
  price: { color: "#00a884", fontWeight: "bold", marginTop: "5px" },
  quantityControls: { display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" },
  qtyBtn: {
    backgroundColor: "#2a3942", border: "none", color: "white",
    width: "30px", height: "30px", borderRadius: "5px", cursor: "pointer"
  },
  deleteBtn: {
    backgroundColor: "transparent", border: "none", color: "#ef4444", cursor: "pointer"
  },

  formColumn: {
    backgroundColor: "#202c33",
    padding: "30px",
    borderRadius: "20px",
    height: "fit-content",
    border: "1px solid #2a3942",
    position: "sticky",
    top: "100px"
  },
  formTitle: { fontSize: "1.5rem", marginBottom: "20px", borderBottom: "2px solid #00a884", paddingBottom: "10px", display: "inline-block" },
  inputGroup: { marginBottom: "15px" },
  label: { display: "block", marginBottom: "5px", color: "#8696a0", fontSize: "0.9rem" },
  inputWrapper: {
    display: "flex", alignItems: "center", gap: "10px",
    backgroundColor: "#111b21", padding: "12px", borderRadius: "10px", border: "1px solid #2a3942"
  },
  input: {
    backgroundColor: "transparent", border: "none", color: "white", width: "100%", outline: "none"
  },
  summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#8696a0" },
  totalRow: { display: "flex", justifyContent: "space-between", marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #2a3942", fontSize: "1.2rem", fontWeight: "bold" },
  payBtn: {
    width: "100%", padding: "15px", marginTop: "20px",
    backgroundColor: "#00a884", color: "white", border: "none", borderRadius: "10px",
    fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer", display: "flex",
    justifyContent: "center", alignItems: "center", gap: "10px", transition: "0.3s"
  }
};

export default function Cart() {
  const context = useContext(CartContext);
  const { cart, removeFromCart, updateQuantity, clearCart } = context;
  
  // Total seguro
  const finalTotal = context.total !== undefined ? context.total : (context.totalPrice !== undefined ? context.totalPrice : 0);

  const { user } = useContext(AuthContext); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        address: user.address 
          ? `${user.address.street || ''} ${user.address.number || ''}, ${user.address.city || ''}`.trim() 
          : ""
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cart || cart.length === 0) return alert("Tu carrito está vacío");

    try {
      // --- CORRECCIÓN CLAVE: Asegurar que el precio NUNCA sea undefined ---
      const formattedItems = cart.map(item => {
          // Buscamos el precio en varias propiedades posibles
          const price = item.price_eur || item.price || item.price_at_purchase || 0;
          
          return {
              vinyl: item._id,              
              quantity: item.quantity,
              // Forzamos que sea un número. Si es 0 o inválido, enviamos 0.
              price_at_purchase: Number(price) 
          };
      });

      const orderData = {
        items: formattedItems, 
        total_price: finalTotal,
        shipping_address: {
            street: formData.address, 
            city: user?.address?.city || "N/A", 
            zipCode: user?.address?.zipCode || "" 
        }
      };

      console.log("🚀 Enviando Pedido:", orderData); // Mira la consola para ver qué se envía

      await api.post("/orders", orderData);
      
      clearCart();
      alert("¡Pedido realizado con éxito!");
      
      if (user) {
        navigate("/profile");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("Error al comprar:", error.response?.data || error.message);
      const serverMsg = error.response?.data?.error || error.response?.data?.message || "Hubo un error al procesar tu pedido.";
      alert("Error: " + serverMsg);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div style={{...styles.container, textAlign: "center", paddingTop: "100px"}}>
        <ShoppingBag size={60} color="#00a884" style={{marginBottom: "20px"}}/>
        <h1>Tu carrito está vacío</h1>
        <Link to="/catalogo" style={{color: "#00a884", textDecoration: "none", fontSize: "1.2rem", marginTop: "20px", display: "inline-block"}}>
           <ArrowLeft size={20} style={{verticalAlign: "middle"}}/> Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Tu Carrito</h1>
        <p style={{color: "#8696a0"}}>{cart.length} productos añadidos</p>
      </div>

      <div style={styles.cartGrid}>
        
        {/* COLUMNA ITEMS */}
        <div style={styles.itemsColumn}>
          {cart.map((item) => (
            <div key={item._id} style={styles.itemCard}>
              <img src={item.cover_image} alt={item.title} style={styles.img} />
              <div style={styles.info}>
                <div style={styles.itemTitle}>{item.title}</div>
                <div style={styles.itemArtist}>{item.artist_name}</div>
                
                {/* Visualización del precio segura */}
                <div style={styles.price}>
                    {(item.price_eur || item.price || 0)} €
                </div>
                
                <div style={styles.quantityControls}>
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={styles.qtyBtn}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={styles.qtyBtn}>+</button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item._id)} style={styles.deleteBtn}>
                <Trash2 />
              </button>
            </div>
          ))}
        </div>

        {/* COLUMNA FORMULARIO */}
        <div style={styles.formColumn}>
          <h2 style={styles.formTitle}>Datos de Envío</h2>
          
          <form onSubmit={handleSubmit}>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nombre Completo</label>
              <div style={styles.inputWrapper}>
                <User size={18} color="#8696a0"/>
                <input 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                  placeholder="Tu nombre..." 
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Correo Electrónico</label>
              <div style={styles.inputWrapper}>
                <Mail size={18} color="#8696a0"/>
                <input 
                  name="email" 
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  placeholder="ejemplo@correo.com" 
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Dirección de Entrega</label>
              <div style={styles.inputWrapper}>
                <MapPin size={18} color="#8696a0"/>
                <input 
                  name="address" 
                  value={formData.address}
                  onChange={handleInputChange}
                  required 
                  placeholder="Calle, Número, Ciudad..." 
                  style={styles.input}
                />
              </div>
            </div>

            <div style={{marginTop: "30px"}}>
              <div style={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{Number(finalTotal).toFixed(2)} €</span>
              </div>
              <div style={styles.summaryRow}>
                  <span>Envío</span>
                  <span style={{color: "#00a884"}}>Gratis</span>
              </div>
              <div style={styles.totalRow}>
                  <span>Total a Pagar</span>
                  <span>{Number(finalTotal).toFixed(2)} €</span>
              </div>
            </div>

            <button type="submit" style={styles.payBtn}>
              Confirmar Pedido <CreditCard size={20}/>
            </button>
          </form>

        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
            div[class*="cartGrid"] {
                grid-template-columns: 1fr !important;
            }
        }
      `}</style>
    </div>
  );
}