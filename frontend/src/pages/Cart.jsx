import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext"; 
import { Trash2, ArrowLeft, ShoppingBag, CreditCard, User, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

// --- URL DEL SERVIDOR PARA LAS IMÁGENES ---
// Si tu backend está en otro puerto, cámbialo aquí (ej: 4000)
const SERVER_URL = "http://localhost:5000";

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
  
  // Usamos CSS Grid, pero la responsividad la maneja el bloque <style> abajo
  cartGrid: {
    display: "grid", 
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
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  image: {
    width: "80px", height: "80px", borderRadius: "10px", objectFit: "cover",
    backgroundColor: "#2a3942"
  },
  info: { flex: 1 },
  itemTitle: { fontSize: "1.1rem", fontWeight: "bold", color: "#e9edef", margin: 0 },
  itemArtist: { color: "#8696a0", fontSize: "0.9rem", margin: "4px 0" },
  itemPrice: { color: "#00a884", fontWeight: "bold", fontSize: "1.1rem" },
  
  controls: { display: "flex", alignItems: "center", gap: "15px", marginTop: "10px" },
  qtyBtn: {
    backgroundColor: "#2a3942", color: "#e9edef", border: "none",
    width: "30px", height: "30px", borderRadius: "8px", cursor: "pointer",
    fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center"
  },
  deleteBtn: {
    backgroundColor: "transparent", border: "none", color: "#ef4444", 
    cursor: "pointer", padding: "5px"
  },

  summaryCard: {
    backgroundColor: "#202c33",
    borderRadius: "15px",
    padding: "30px",
    height: "fit-content",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    position: "sticky",
    top: "20px"
  },
  summaryTitle: { fontSize: "1.5rem", fontWeight: "bold", marginBottom: "20px", borderBottom: "1px solid #2a3942", paddingBottom: "10px" },
  inputWrapper: {
    display: "flex", alignItems: "center", backgroundColor: "#0b141a",
    borderRadius: "8px", padding: "10px 15px", marginBottom: "15px", gap: "10px",
    border: "1px solid #2a3942"
  },
  input: {
    backgroundColor: "transparent", border: "none", color: "#e9edef",
    width: "100%", outline: "none", fontSize: "1rem"
  },
  label: { display: "block", marginBottom: "5px", color: "#8696a0", fontSize: "0.9rem" },
  
  summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#8696a0" },
  totalRow: { display: "flex", justifyContent: "space-between", marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #2a3942", fontSize: "1.5rem", fontWeight: "bold", color: "#e9edef" },
  
  payBtn: {
    width: "100%", backgroundColor: "#00a884", color: "white", border: "none",
    padding: "15px", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "bold",
    cursor: "pointer", marginTop: "20px", display: "flex", alignItems: "center",
    justifyContent: "center", gap: "10px", transition: "0.3s"
  },
  empty: {
    textAlign: "center", marginTop: "100px", display: "flex", flexDirection: "column",
    alignItems: "center", gap: "20px"
  },
  linkBtn: {
    color: "#00a884", textDecoration: "none", fontSize: "1.2rem", fontWeight: "bold",
    display: "flex", alignItems: "center", gap: "8px"
  }
};

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: ""
  });

  // --- FUNCIÓN PARA ARREGLAR LAS IMÁGENES ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/80";
    // Si ya tiene http (es una url externa), la dejamos igual
    if (imagePath.startsWith("http")) return imagePath;
    // Si es una ruta local (ej: /uploads/foto.jpg), le pegamos el localhost
    return `${SERVER_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const finalTotal = cart.reduce((sum, item) => {
    const safePrice = Number(item.price_eur !== undefined ? item.price_eur : item.price) || 0;
    return sum + (safePrice * item.quantity);
  }, 0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Debes iniciar sesión para comprar");
      navigate("/login");
      return;
    }

    try {
      const orderData = {
        items: cart.map(item => ({
            product: item._id,
            quantity: item.quantity,
            price: Number(item.price_eur || item.price)
        })),
        totalAmount: finalTotal,
        shippingAddress: formData.address, 
        paymentStatus: 'pending'
      };

      const response = await api.post('/orders', orderData);

      if (response.status === 201) {
        alert("✅ ¡Pedido realizado con éxito!");
        clearCart();
        navigate("/my-orders");
      }
    } catch (error) {
      console.error("Error en checkout:", error);
      alert("Hubo un error al procesar el pedido.");
    }
  };

  if (cart.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.empty}>
          <ShoppingBag size={80} color="#2a3942" />
          <h2>Tu carrito está vacío</h2>
          <p style={{color: "#8696a0"}}>¿Por qué no añades algo de música?</p>
          <Link to="/" style={styles.linkBtn}>
            <ArrowLeft size={20}/> Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Tu Pedido</h1>
        <p style={{color: "#8696a0"}}>Revisa tus vinilos y completa el envío</p>
      </div>

      <div style={styles.cartGrid} className="cart-grid">
        
        {/* COLUMNA IZQUIERDA: PRODUCTOS */}
        <div style={styles.itemsColumn}>
          {cart.map((item) => {
             const safePrice = Number(item.price_eur !== undefined ? item.price_eur : item.price) || 0;
             
             return (
                <div key={item._id} style={styles.itemCard}>
                    <img 
                        // --- USAMOS LA NUEVA FUNCIÓN AQUÍ ---
                        src={getImageUrl(item.cover_image)}
                        alt={item.title} 
                        style={styles.image}
                        onError={(e) => {e.target.src = "https://via.placeholder.com/80"}}
                    />
                    <div style={styles.info}>
                        <h3 style={styles.itemTitle}>{item.title}</h3>
                        <p style={styles.itemArtist}>{item.artist_name}</p>
                        <p style={styles.itemPrice}>{safePrice.toFixed(2)} €</p>
                        
                        <div style={styles.controls}>
                            <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                <button style={styles.qtyBtn} onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                <span style={{fontWeight: "bold"}}>{item.quantity}</span>
                                <button style={styles.qtyBtn} onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                            </div>
                            <button style={styles.deleteBtn} onClick={() => removeFromCart(item._id)}>
                                <Trash2 size={18}/>
                            </button>
                        </div>
                    </div>
                </div>
             );
          })}
        </div>

        {/* COLUMNA DERECHA: DATOS DE ENVÍO */}
        <div style={styles.summaryCard}>
          <h2 style={styles.summaryTitle}>Datos de Envío</h2>
          
          <form onSubmit={handleCheckout}>
            <div style={{marginBottom: "15px"}}>
              <label style={styles.label}>Nombre Completo</label>
              <div style={styles.inputWrapper}>
                <User size={18} color="#8696a0"/>
                <input 
                    defaultValue={user?.name || ""} 
                    disabled 
                    style={{...styles.input, color: "#8696a0", cursor: "not-allowed"}}
                />
              </div>
            </div>

            <div style={{marginBottom: "15px"}}>
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
                  <span>{finalTotal.toFixed(2)} €</span>
              </div>
              <div style={styles.summaryRow}>
                  <span>Envío</span>
                  <span style={{color: "#00a884"}}>Gratis</span>
              </div>
              <div style={styles.totalRow}>
                  <span>Total a Pagar</span>
                  <span>{finalTotal.toFixed(2)} €</span>
              </div>
            </div>

            <button type="submit" style={styles.payBtn}>
              Confirmar Pedido <CreditCard size={20}/>
            </button>
          </form>

        </div>
      </div>
      
      {/* --- RESPONSIVIDAD --- */}
      <style>{`
        /* Por defecto (Escritorio) */
        .cart-grid {
            grid-template-columns: 1.5fr 1fr;
        }

        /* En tablet y móvil */
        @media (max-width: 900px) {
            .cart-grid {
                grid-template-columns: 1fr !important;
            }
        }
      `}</style>
    </div>
  );
};

export default Cart;