import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function VinylCard({ vinyl }) {
  const { addToCart } = useContext(CartContext) || { addToCart: () => console.log("Carrito no implementado aún") };

  return (
    <div className="vinyl-card group" style={{ minWidth: "220px", maxWidth: "220px", scrollSnapAlign: "start" }}>
      <div className="relative mb-3">
        <Link to={`/product/${vinyl._id}`}>
          <img
            src={vinyl.cover_image || "https://via.placeholder.com/300?text=No+Cover"}
            alt={vinyl.title}
            style={{
              width: "100%",
              aspectRatio: "1/1",
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid #111",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
            }}
            className="transition-transform duration-[3s] hover:rotate-[360deg]"
          />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "15px", height: "15px", background: "#121212", borderRadius: "50%" }}></div>
        </Link>
      </div>

      <div className="text-center">
        <h3 style={{ fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{vinyl.title}</h3>
        <p style={{ fontSize: "0.9rem", color: "#aaa" }}>{vinyl.artist_name}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
          <span style={{ color: "#bb86fc", fontWeight: "bold" }}>{vinyl.price} €</span>
          <button
            onClick={() => addToCart(vinyl)}
            style={{ background: "#fff", color: "#000", border: "none", padding: "4px 12px", borderRadius: "20px", fontWeight: "bold", cursor: "pointer" }}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}