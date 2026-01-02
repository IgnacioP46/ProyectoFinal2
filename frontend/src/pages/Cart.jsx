import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Trash2, ArrowLeft, ShoppingBag, CreditCard, User, MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

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
  
  // Grid principal: Izquierda (Items) | Derecha (Formulario)
  cartGrid: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr", 
    gap: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  
  // --- LISTA DE ITEMS ---
  itemsColumn: { display: "flex", flexDirection: "column", gap: "20px" },
  itemCard: {
    display: "flex",
    backgroundColor: "#202c33",
    borderRadius: "15px",
    padding: "15px",
    alignItems: "center",
    gap: "20px",
    border: "1px solid #2a3942",
  },
  itemImg: {
    width: "80px",
    height: "80px",
    borderRadius: "10px",
    objectFit: "cover",
    backgroundColor: "#000",
  },
  itemInfo: { flexGrow: 1 },
  itemTitle: { margin: "0 0 5px 0", fontSize: "1.1rem", fontWeight: "bold", color: "#e9edef" },
  itemArtist: { margin: 0, color: "#8696a0", fontSize: "0.9rem" },
  itemPrice: { fontSize: "1.2rem", fontWeight: "bold", color: "#00a884" },
  deleteBtn: {
    background: "transparent",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    padding: "10px",
  },

  // --- FORMULARIO DE PAGO (DERECHA) ---
  checkoutForm: {
    backgroundColor: "#202c33",
    padding: "30px",
    borderRadius: "20px",
    border: "1px solid #2a3942",
    height: "fit-content",
    position: "sticky",
    top: "20px",
  },
  formTitle: { fontSize: "1.5rem", fontWeight: "bold", marginBottom: "20px", borderBottom: "1px solid #2a3942", paddingBottom: "15px" },
  inputGroup: { marginBottom: "15px" },
  label: { display: "block", marginBottom: "8px", color: "#8696a0", fontSize: "0.9rem" },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#111b21",
    border: "1px solid #2a3942",
    borderRadius: "10px",
    padding: "10px 15px",
    gap: "10px",
  },
  input: {
    background: "transparent",
    border: "none",
    color: "#fff",
    width: "100%",
    outline: "none",
    fontSize: "1rem",
  },
  summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#d1d7db" },
  totalRow: {
    display: "flex", justifyContent: "space-between", marginTop: "20px", paddingTop: "15px",
    borderTop: "1px solid #2a3942", fontSize: "1.5rem", fontWeight: "bold", color: "#00a884"
  },
  payBtn: {
    backgroundColor: "#00a884",
    color: "#111b21",
    border: "none",
    width: "100%",
    padding: "15px",
    borderRadius: "50px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    marginTop: "25px",
    cursor: "pointer",
    display: "flex", justifyContent: "center", alignItems: "center", gap: "10px",
    transition: "transform 0.1s",
  },

  // --- VACÍO ---
  emptyContainer: { textAlign: "center", marginTop: "50px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" },
  btnOutline: {
    backgroundColor: "transparent", border: "1px solid #00a884", color: "#00a884",
    padding: "10px 25px", borderRadius: "50px", textDecoration: "none", fontWeight: "bold",
    display: "inline-flex", alignItems: "center", gap: "10px", cursor: "pointer"
  }
};

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  
  // Estado para el formulario
  const [formData, setFormData] = useState({ name: "", email: "", address: "" });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`¡Pedido recibido, ${formData.name}!\nTe enviaremos la confirmación a ${formData.email}.`);
    clearCart();
  };

  // Calcular total asegurando que los precios sean números
  const totalPrice = cart.reduce((acc, item) => {
    const price = parseFloat(item.price || item.price_eur || item.precio || 0);
    return acc + (price * item.quantity);
  }, 0);

  // --- VISTA: CARRITO VACÍO ---
  if (cart.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyContainer}>
          <ShoppingBag size={80} color="#2a3942" />
          <h2 style={{color: "#8696a0"}}>Tu carrito está vacío</h2>
          <Link to="/catalogo" style={styles.btnOutline}>
            <ArrowLeft size={20} /> Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  // --- VISTA: CON PRODUCTOS ---
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Finalizar Compra</h1>
      </div>

      <div style={styles.cartGrid}>
        
        {/* COLUMNA IZQUIERDA: PRODUCTOS */}
        <div style={styles.itemsColumn}>
          {cart.map((item) => {
            // Lógica "todoterreno" para encontrar los datos
            const image = item.image || item.cover_image || item.imagen || "https://via.placeholder.com/100";
            const title = item.title || item.titulo || "Sin título";
            const artist = item.artist || item.artist_name || item.artista || "Desconocido";
            const price = parseFloat(item.price || item.price_eur || item.precio || 0);

            return (
              <div key={item._id} style={styles.itemCard}>
                <img src={image} alt={title} style={styles.itemImg} />
                <div style={styles.itemInfo}>
                  <h3 style={styles.itemTitle}>{title}</h3>
                  <p style={styles.itemArtist}>{artist}</p>
                  <span style={{color:"#8696a0", fontSize:"0.85rem"}}>Cant: {item.quantity}</span>
                </div>
                <div style={styles.itemPrice}>
                  {(price * item.quantity).toFixed(2)} €
                </div>
                <button onClick={() => removeFromCart(item._id)} style={styles.deleteBtn}>
                  <Trash2 size={20} />
                </button>
              </div>
            );
          })}

          <div style={{textAlign: "right"}}>
             <button onClick={clearCart} style={{...styles.btnOutline, color: "#ef4444", borderColor: "#ef4444", border: "none"}}>
               Vaciar todo
             </button>
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO GUEST CHECKOUT */}
        <form style={styles.checkoutForm} onSubmit={handleSubmit}>
          <h3 style={styles.formTitle}>Datos de Envío</h3>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nombre Completo</label>
            <div style={styles.inputWrapper}>
              <User size={18} color="#8696a0"/>
              <input 
                name="name" 
                required 
                placeholder="Ej: Juan Pérez" 
                style={styles.input} 
                onChange={handleInputChange}
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
                required 
                placeholder="juan@email.com" 
                style={styles.input}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Dirección de Entrega</label>
            <div style={styles.inputWrapper}>
              <MapPin size={18} color="#8696a0"/>
              <input 
                name="address" 
                required 
                placeholder="Calle, Número, Ciudad..." 
                style={styles.input}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div style={{marginTop: "30px"}}>
            <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{totalPrice.toFixed(2)} €</span>
            </div>
            <div style={styles.summaryRow}>
                <span>Envío</span>
                <span style={{color: "#00a884"}}>Gratis</span>
            </div>
            <div style={styles.totalRow}>
                <span>Total a Pagar</span>
                <span>{totalPrice.toFixed(2)} €</span>
            </div>
          </div>

          <button type="submit" style={styles.payBtn}>
            Confirmar Pedido <CreditCard size={20}/>
          </button>
        </form>

      </div>

      {/* CSS Responsive para móviles */}
      <style>{`
        @media (max-width: 900px) {
            div[style*="grid-template-columns"] {
                grid-template-columns: 1fr !important;
            }
            form { position: static !important; }
        }
      `}</style>
    </div>
  );
}