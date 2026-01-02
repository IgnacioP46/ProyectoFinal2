import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Check, Disc, Music } from "lucide-react";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";

// --- ESTILOS (Dark Mode Premium) ---
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0b141a",
    color: "#e9edef",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "40px 5%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  contentWrapper: {
    maxWidth: "1100px",
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "50px",
    alignItems: "start",
  },
  imageContainer: {
    backgroundColor: "#202c33",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #2a3942",
  },
  image: {
    width: "100%",
    maxWidth: "450px",
    height: "auto",
    borderRadius: "10px",
    objectFit: "cover",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingTop: "20px",
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    color: "#8696a0",
    textDecoration: "none",
    fontWeight: "bold",
    marginBottom: "20px",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "800",
    margin: "0 0 10px 0",
    lineHeight: "1.1",
    color: "#e9edef",
  },
  artist: {
    fontSize: "1.5rem",
    color: "#00a884",
    margin: "0 0 20px 0",
    fontWeight: "600",
  },
  metaData: {
    display: "flex",
    gap: "20px",
    borderTop: "1px solid #2a3942",
    borderBottom: "1px solid #2a3942",
    padding: "20px 0",
    marginBottom: "20px",
    color: "#8696a0",
    fontSize: "0.95rem",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  price: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#e9edef",
    marginBottom: "20px",
  },
  description: {
    lineHeight: "1.6",
    color: "#d1d7db",
    fontSize: "1.1rem",
    marginBottom: "30px",
  },
  buyBtn: {
    backgroundColor: "#00a884",
    color: "#111b21",
    border: "none",
    padding: "18px 32px",
    borderRadius: "50px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "transform 0.1s, background 0.2s",
    width: "fit-content",
    boxShadow: "0 4px 15px rgba(0, 168, 132, 0.4)",
  },
  centerMessage: { textAlign: "center" },
  errorTitle: { color: "#ef4444", fontSize: "2rem", marginBottom: "10px" },
  errorText: { color: "#8696a0", marginBottom: "20px" }
};

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [vinyl, setVinyl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchVinyl = async () => {
      try {
        const response = await api.get(`/vinyls/${id}`);
        
        // Verificamos si recibimos datos
        if (!response.data) throw new Error("Datos vacíos");
        
        setVinyl(response.data);
      } catch (err) {
        console.error("Error Fetch:", err);
        if (err.response && err.response.status === 404) {
            setError("Disco no encontrado (404).");
        } else {
            setError("Error cargando el producto.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVinyl();
  }, [id]);

  const handleBuy = () => {
    addToCart(vinyl);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div style={styles.container}><h2 style={{color:"#8696a0"}}>Cargando...</h2></div>;
  
  if (error || !vinyl) return (
      <div style={styles.container}>
        <div style={styles.centerMessage}>
          <h1 style={styles.errorTitle}>Error</h1>
          <p style={styles.errorText}>{error}</p>
          <Link to="/catalogo" style={{...styles.buyBtn, textDecoration:'none', margin:'0 auto'}}>
            <ArrowLeft /> Volver
          </Link>
        </div>
      </div>
  );

  // --- LÓGICA DE SEGURIDAD PARA NOMBRES DE CAMPOS ---
  // Esto busca el dato aunque tenga nombre diferente en la BD
  const title = vinyl.title || vinyl.titulo || "Sin título";
  const artist = vinyl.artist_name || vinyl.artista || vinyl.artist || "Artista desconocido";
  const image = vinyl.cover_image || vinyl.imagen || vinyl.img || "https://via.placeholder.com/500";
  const price = vinyl.price_eur || vinyl.price || vinyl.precio || 0;
  const genre = vinyl.genre || vinyl.genero || "Variado";
  const year = vinyl.year || vinyl.año || vinyl.anio || "????";
  const stock = vinyl.stock || vinyl.existencias || 0;
  const description = vinyl.description || vinyl.descripcion || "Sin descripción disponible.";

  return (
    <div style={{...styles.container, display: "block"}}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <Link to="/catalogo" style={styles.backLink}>
            <ArrowLeft size={18} /> Volver al catálogo
        </Link>

        {/* DEBUG: Si esto muestra datos, la conexión funciona */}
        {/* <pre style={{color:'lime', background:'#000', padding:10}}>{JSON.stringify(vinyl, null, 2)}</pre> */}

        <div style={styles.contentWrapper}>
            {/* Imagen */}
            <div style={styles.imageContainer}>
                <img src={image} alt={title} style={styles.image} />
            </div>

            {/* Detalles */}
            <div style={styles.details}>
                <h1 style={styles.title}>{title}</h1>
                <h2 style={styles.artist}>{artist}</h2>

                <div style={styles.metaData}>
                    <div style={styles.metaItem}><Disc size={18}/> {genre}</div>
                    <div style={styles.metaItem}><Music size={18}/> {year}</div>
                    {stock > 0 ? (
                         <div style={{...styles.metaItem, color: "#00a884", fontWeight: "bold"}}>
                            <Check size={18}/> En Stock ({stock})
                         </div>
                    ) : (
                        <div style={{...styles.metaItem, color: "#ef4444", fontWeight: "bold"}}>
                            Agotado
                         </div>
                    )}
                </div>

                <div style={styles.price}>{Number(price).toFixed(2)} €</div>

                <p style={styles.description}>{description}</p>

                <button 
                    onClick={handleBuy} 
                    disabled={stock <= 0}
                    style={{
                        ...styles.buyBtn, 
                        backgroundColor: added ? "#202c33" : "#00a884",
                        color: added ? "#00a884" : "#111b21",
                        border: added ? "1px solid #00a884" : "none"
                    }}
                >
                    {added ? (<>¡Añadido! <Check /></>) : (<>Añadir al Carrito <ShoppingCart /></>)}
                </button>
            </div>
        </div>
      </div>
      
      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
            div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; gap: 30px !important; }
            img { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}