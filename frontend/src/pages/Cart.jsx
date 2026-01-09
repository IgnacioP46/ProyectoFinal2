import React, { useContext, useState, useEffect, useMemo } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext"; 
import { Trash2, ArrowLeft, ShoppingBag, User, MapPin, Mail, PackageCheck } from "lucide-react";
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
    gap: "20px",
    alignItems: "center",
    border: "1px solid #2a3942",
    position: "relative"
  },
  image: {
    width: "100px",
    height: "100px",
    borderRadius: "10px",
    objectFit: "cover",
    backgroundColor: "#000",
    border: "1px solid #333"
  },
  info: { flex: 1 },
  songTitle: { fontSize: "1.2rem", fontWeight: "bold", color: "#e9edef", marginBottom: "4px" },
  artist: { color: "#8696a0", fontSize: "0.9rem", marginBottom: "8px" },
  price: { color: "#00a884", fontWeight: "bold", fontSize: "1.1rem" },
  
  qtyLabel: {
    color: "#8696a0", 
    fontSize: "0.9rem", 
    fontWeight: "bold",
    backgroundColor: "#0b141a",
    padding: "5px 10px",
    borderRadius: "8px",
    border: "1px solid #2a3942",
    whiteSpace: "nowrap"
  },
  
  deleteBtn: {
    background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "10px",
    display: "flex", alignItems: "center", justifyContent: "center"
  },
  
  summaryCard: {
    backgroundColor: "#202c33",
    padding: "30px",
    borderRadius: "20px",
    border: "1px solid #2a3942",
    height: "fit-content",
    position: "sticky",
    top: "20px"
  },
  summaryTitle: { fontSize: "1.5rem", fontWeight: "bold", marginBottom: "20px", borderBottom: "1px solid #2a3942", paddingBottom: "15px" },
  
  inputGroup: { marginBottom: "15px" },
  inputWrapper: {
    display: "flex", alignItems: "center", gap: "10px",
    backgroundColor: "#0b141a", padding: "12px 15px", borderRadius: "10px",
    border: "1px solid #2a3942"
  },
  input: {
    backgroundColor: "transparent", border: "none", color: "white", outline: "none", width: "100%", fontSize: "0.95rem"
  },
  
  summaryRow: { display: "flex", justifyContent: "space-between", marginBottom: "15px", color: "#8696a0" },
  totalRow: { display: "flex", justifyContent: "space-between", fontSize: "1.5rem", fontWeight: "bold", marginTop: "20px", borderTop: "1px solid #2a3942", paddingTop: "20px" },
  
  payBtn: {
    width: "100%", padding: "15px", backgroundColor: "#00a884", color: "white", 
    border: "none", borderRadius: "50px", fontWeight: "bold", fontSize: "1.1rem", 
    marginTop: "25px", cursor: "pointer", display: "flex", justifyContent: "center", gap: "10px", alignItems: "center",
    transition: "transform 0.2s"
  },
  
  emptyState: { textAlign: "center", padding: "50px", color: "#8696a0" },
  backBtn: { display: "inline-flex", alignItems: "center", gap: "5px", color: "#00a884", textDecoration: "none", fontWeight: "bold", marginTop: "20px" }
};

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: ""
  });

  const total = useMemo(() => {
    return cart.reduce((acc, item) => {
        const data = item.vinyl || item;
        const price = parseFloat(data.price_eur || data.price || 0);
        return acc + (price * (item.quantity || 1));
    }, 0);
  }, [cart]);

  const shippingCost = total >= 60 ? 0 : 4.95;
  const finalTotal = total + shippingCost;

  useEffect(() => {
    if (user) {
        const userAddr = user.address || {};
        const fullAddress = [userAddr.street, userAddr.number, userAddr.city, userAddr.zipCode].filter(Boolean).join(", ");
        
        setFormData({
            name: user.name || "",
            email: user.email || "",
            address: fullAddress || ""
        });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Carrito vacío");

    // Validación extra para invitados
    if (!user && (!formData.name || !formData.email || !formData.address)) {
        return alert("Por favor, rellena todos los campos para poder enviarte el pedido.");
    }

    try {
        const orderData = {
            // Si hay usuario, enviamos su ID. Si no, enviamos null.
            user: user ? user._id : null,
            userId: user ? user._id : null,
            
            items: cart.map(item => {
                const data = item.vinyl || item;
                return {
                    vinyl: data._id,
                    vinylId: data._id,
                    quantity: item.quantity || 1,
                    price_at_purchase: data.price_eur || data.price
                };
            }),
            total_price: finalTotal,
            shipping_address: formData.address,
            
            // Si es invitado, enviamos la info explícitamente en guest_info
            guest_info: user ? null : {
                name: formData.name,
                email: formData.email
            }
        };

        await api.post("/orders", orderData);
        
        // --- MENSAJES Y REDIRECCIÓN DIFERENCIADA ---
        clearCart();
        
        if (user) {
            alert(`¡Pedido confirmado! Gracias ${user.name}. Puedes verlo en tu perfil.`);
            navigate("/profile");
        } else {
            // Mensaje para invitados
            alert(`¡Pedido confirmado! Gracias ${formData.name}. Hemos enviado los detalles de tu compra a ${formData.email}.`);
            navigate("/"); // Al home
        }

    } catch (error) {
        console.error("Error checkout:", error);
        // Mensaje de error genérico, ya no culpamos al login
        alert("Hubo un problema procesando el pedido. Por favor, inténtalo de nuevo.");
    }
  };

  if (cart.length === 0) {
    return (
        <div style={styles.container}>
            <div style={styles.emptyState}>
                <ShoppingBag size={80} style={{marginBottom: "20px", opacity: 0.3}} />
                <h2>Tu carrito está vacío</h2>
                <p>¡Añade algunos vinilos para empezar a girar!</p>
                <Link to="/catalogo" style={styles.backBtn}>
                    <ArrowLeft size={20}/> Ir al Catálogo
                </Link>
            </div>
        </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Tu Carrito</h1>
        <p style={{color: "#8696a0"}}>{cart.length} discos seleccionados</p>
      </div>

      <div className="cart-grid" style={styles.cartGrid}>
        
        <div style={styles.itemsColumn}>
          {cart.map((item) => {
            const data = item.vinyl || item;
            
            const displayTitle = data.title || "Sin título";
            const displayArtist = data.artist_name || data.artist || "Artista desconocido";
            const displayPrice = data.price_eur || data.price || 0;
            const displayImage = data.cover_image || data.image || "https://placehold.co/100/111/fff?text=No+Img";

            return (
                <div key={item._id} style={styles.itemCard}>
                    <img 
                      src={displayImage} 
                      alt={displayTitle} 
                      style={styles.image}
                      onError={(e) => { e.target.src = "https://placehold.co/100/111/fff?text=Error"; }}
                    />
                    
                    <div style={styles.info}>
                      <div style={styles.songTitle}>{displayTitle}</div>
                      <div style={styles.artist}>{displayArtist}</div>
                      <div style={styles.price}>{Number(displayPrice).toFixed(2)} €</div>
                    </div>

                    <div style={styles.qtyLabel}>
                        Cant: {item.quantity || 1}
                    </div>

                    <button onClick={() => removeFromCart(item._id)} style={styles.deleteBtn} title="Eliminar">
                        <Trash2 size={20}/>
                    </button>
                </div>
            );
          })}
           <Link to="/catalogo" style={{display:"inline-flex", alignItems:"center", gap:"5px", color: "#00a884", textDecoration:"none", fontWeight:"bold", marginTop:"10px"}}>
             <ArrowLeft size={18}/> Seguir comprando
          </Link>
        </div>

        <div style={styles.summaryCard}>
          <h2 style={styles.summaryTitle}>Datos de Envío</h2>
          
          <form onSubmit={handleSubmit}>
            
            <div style={styles.inputGroup}>
                <div style={styles.inputWrapper}>
                    <User size={18} color="#8696a0"/>
                    <input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Nombre Completo" 
                        style={styles.input} 
                    />
                </div>
            </div>

            <div style={styles.inputGroup}>
                <div style={styles.inputWrapper}>
                    <Mail size={18} color="#8696a0"/>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Correo Electrónico" 
                        style={styles.input} 
                    />
                </div>
            </div>

            <div style={styles.inputGroup}>
                <div style={styles.inputWrapper}>
                    <MapPin size={18} color="#8696a0"/>
                    <input 
                        name="address" 
                        value={formData.address} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Dirección Completa" 
                        style={styles.input} 
                    />
                </div>
            </div>

            <div style={{marginTop: "30px"}}>
              <div style={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{total.toFixed(2)} €</span>
              </div>
              <div style={styles.summaryRow}>
                  <span>Envío {total >= 60 && "(Gratis > 60€)"}</span>
                  <span style={{color: total >= 60 ? "#00a884" : "#e9edef"}}>
                    {shippingCost === 0 ? "Gratis" : `${shippingCost} €`}
                  </span>
              </div>
              <div style={styles.totalRow}>
                  <span>Total a Pagar</span>
                  <span style={{color: "#00a884"}}>{finalTotal.toFixed(2)} €</span>
              </div>
            </div>

            <button type="submit" style={styles.payBtn}>
              Confirmar Pedido <PackageCheck size={20}/>
            </button>
          </form>
        </div>
      </div>
      
      <style>{`
        .cart-grid { grid-template-columns: 1.5fr 1fr; }
        @media (max-width: 900px) {
            .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Cart;