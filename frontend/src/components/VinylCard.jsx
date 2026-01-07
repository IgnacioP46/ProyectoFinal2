import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const styles = {
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
    scrollSnapAlign: "start"
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
  buyButtonSmall: {
    backgroundColor: "#10B981",
    color: "white",
    border: "none",
    borderRadius: "20px",
    padding: "5px 15px",
    fontSize: "0.9rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.2s",
  }
};

export default function VinylCard({ vinyl }) {
  // Protección por si el contexto no está cargado
  const { addToCart } = useContext(CartContext) || { addToCart: () => console.log("Contexto no cargado") };

  const handleQuickBuy = (e) => {
    e.preventDefault();
    addToCart(vinyl);
    alert(`¡${vinyl.title} añadido al carrito! 🛒`);
  };

  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
    >
      <Link to={`/vinyls/${vinyl._id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div style={styles.cardImageContainer}>
          {vinyl.cover_image ? (
            <img src={vinyl.cover_image} alt={vinyl.title} style={styles.cardImage} />
          ) : (
            <span>💿</span>
          )}
        </div>
      </Link>

      <div style={styles.cardContent}>
        <Link to={`/vinyls/${vinyl._id}`} style={{ textDecoration: "none" }}>
          <h3 style={styles.cardTitle} title={vinyl.title}>{vinyl.title}</h3>
        </Link>
        <p style={styles.cardArtist}>{vinyl.artist_name}</p>

        <div style={styles.priceRow}>
          <span style={styles.cardPrice}>
            {typeof vinyl.price === 'number' ? vinyl.price : Number(vinyl.price)}€
          </span>
          <button
            onClick={handleQuickBuy}
            style={styles.buyButtonSmall}
            onMouseOver={(e) => e.target.style.backgroundColor = "#059669"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#10B981"}
          >
            COMPRAR
          </button>
        </div>
      </div>
    </div>
  );
}