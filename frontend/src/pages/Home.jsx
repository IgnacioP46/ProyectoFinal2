import { useEffect, useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";


const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heroSection: {
    textAlign: "center",
    marginBottom: "60px",
    padding: "60px 20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "800",
    color: "#2d3748",
    marginBottom: "1rem",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#718096",
    marginBottom: "2rem",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  ctaButton: {
    display: "inline-block",
    backgroundColor: "#6b46c1",
    color: "white",
    padding: "15px 40px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    borderRadius: "50px",
    textDecoration: "none",
    boxShadow: "0 4px 15px rgba(107, 70, 193, 0.4)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "20px",
    paddingLeft: "10px",
    borderLeft: "5px solid #6b46c1",
  },
  carouselContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  carouselTrack: {
    display: "flex",
    gap: "25px",
    overflowX: "auto",
    scrollBehavior: "smooth",
    padding: "20px 5px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  card: {
    minWidth: "240px",
    maxWidth: "240px",
    backgroundColor: "white",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
    transition: "transform 0.3s ease",
    border: "1px solid #edf2f7",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
  },
  cardImageContainer: {
    height: "240px",
    backgroundColor: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "4rem",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardContent: {
    padding: "15px",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    margin: "0 0 5px 0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "#2d3748",
    textDecoration: "none"
  },
  cardArtist: {
    fontSize: "0.9rem",
    color: "#718096",
    margin: "0 0 15px 0",
  },
  priceRow: {
    marginTop: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cardPrice: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#2d3748",
  },
  // ESTILO NUEVO PARA EL BOTÓN COMPRAR
  buyButtonSmall: {
    backgroundColor: "#10B981", // Verde esmeralda
    color: "white",
    border: "none",
    borderRadius: "20px",
    padding: "5px 15px",
    fontSize: "0.9rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  navButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    fontSize: "1.5rem",
    cursor: "pointer",
    zIndex: 10,
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

const adapt = (v) => ({
  _id: v._id ?? v.id,
  title: v.title ?? "Sin título",
  artist_name: v.artist_name ?? v.artist ?? "Desconocido",
  cover_image: v.cover_image ?? "",
  price: typeof v.price === "number" ? v.price : Number(v.price ?? v.price_eur ?? 0) || 0,
});

export default function Home() {
  const [vinyls, setVinyls] = useState([]);
  const [loading, setLoading] = useState(true);
  const rowRef = useRef(null);

  // Usamos el contexto para añadir al carrito
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/vinyls");
        const list = (Array.isArray(data) ? data : []).map(adapt);
        setVinyls(list.slice(0, 10));
      } catch (err) {
        console.error("Error loading home:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = 300;
      rowRef.current.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
    }
  };

  // Función para manejar la compra directa
  const handleQuickBuy = (e, vinyl) => {
    e.preventDefault(); // Evita que el clic nos lleve a la página de detalles
    addToCart(vinyl);   // Llama a la función global del carrito
    alert(`¡${vinyl.title} añadido al carrito! 🛒`); // Feedback visual rápido
  };

  return (
    <div style={styles.container}>

      {/* SECCIÓN HERO */}
      <section style={styles.heroSection}>
        <h1 style={styles.title}>El sonido que buscas.</h1>
        <p style={styles.subtitle}>
          Explora nuestra colección exclusiva de vinilos. Desde clásicos del rock hasta las últimas novedades indie.
        </p>
        <Link
          to="/catalogo"
          style={styles.ctaButton}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-3px)";
            e.target.style.boxShadow = "0 6px 20px rgba(107, 70, 193, 0.6)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(107, 70, 193, 0.4)";
          }}
        >
          Ver Catálogo Completo
        </Link>
      </section>

      {/* SECCIÓN CARRUSEL */}
      <section>
        <h2 style={styles.sectionTitle}>Destacados de la semana 🔥</h2>

        {loading ? (
          <p style={{ textAlign: "center", color: "#888" }}>Cargando éxitos...</p>
        ) : (
          <div style={styles.carouselContainer}>
            <button onClick={() => scroll(-1)} style={{ ...styles.navButton, left: "-20px" }}>❮</button>

            <div ref={rowRef} style={styles.carouselTrack} className="hide-scrollbar">
              {vinyls.map((v) => (
                <div key={v._id} style={styles.card}>

                  {/* El enlace envuelve la imagen para ver detalles */}
                  <Link to={`/vinyls/${v._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={styles.cardImageContainer}>
                      {v.cover_image ? (
                        <img src={v.cover_image} alt={v.title} style={styles.cardImage} />
                      ) : (
                        <span>💿</span>
                      )}
                    </div>
                  </Link>

                  <div style={styles.cardContent}>
                    <Link to={`/vinyls/${v._id}`} style={{ textDecoration: "none" }}>
                      <h3 style={styles.cardTitle} title={v.title}>{v.title}</h3>
                    </Link>
                    <p style={styles.cardArtist}>{v.artist_name}</p>

                    <div style={styles.priceRow}>
                      <span style={styles.cardPrice}>{v.price}€</span>

                      {/* BOTÓN COMPRAR AHORA */}
                      <button
                        onClick={(e) => handleQuickBuy(e, v)}
                        style={styles.buyButtonSmall}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#059669"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#10B981"}
                      >
                        COMPRAR
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            <button onClick={() => scroll(1)} style={{ ...styles.navButton, right: "-20px" }}>❯</button>
          </div>
        )}
      </section>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}