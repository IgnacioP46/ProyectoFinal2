import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { http } from "../api/http";
import React from "react";
import VinylCard from "../components/VinylCard.jsx";

const adapt = (v) => ({
  _id: v._id ?? v.id,
  title: v.title ?? v.name ?? "",
  artist_name: v.artist_name ?? v.artist ?? v.band ?? "",
  cover_image: v.cover_image ?? v.image ?? "",
  genre: v.genre ?? "",
  price: typeof v.price === "number" ? v.price : Number(v.price ?? v.price_eur ?? 0) || 0,
});

export default function Home() {
  const [vinyls, setVinyls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rowRef = useRef(null);

 useEffect(() => {
  (async () => {
    const { data } = await http.get("/vinyls");
    const list = (Array.isArray(data) ? data : []).map(adapt);
    list.sort((a, b) => (a.title || "").localeCompare(b.title || "", "es", { sensitivity: "base" }));
    setVinyls(list);
  })().catch(() => setError("No se pudo cargar el catálogo de vinilos."));
}, []);

  const scrollByAmount = (dir = 1) => {
    const el = rowRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (loading) return <p>Cargando vinilos…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="carousel-wrap">
      <div className="carousel-header">
        <h1>Vinilos destacados</h1>
        <Link to="/catalog" className="catalog-link">Buscar en catálogo</Link>
      </div>

      <div className="carousel">
        <button className="carousel-btn prev" aria-label="Anterior" onClick={() => scrollByAmount(-1)}>‹</button>

        <div className="vinyl-row" ref={rowRef}>
          {vinyls.map(v => (
            <VinylCard key={v._id} vinyl={v} onAddToCart={(item) => console.log("Comprar:", item)} />
          ))}
        </div>

        <button className="carousel-btn next" aria-label="Siguiente" onClick={() => scrollByAmount(1)}>›</button>
      </div>
    </div>
  );
}
