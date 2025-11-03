// src/components/VinylCard.jsx
import React from "react";
import "./VinylCard.css";

const VinylCard = ({ vinyl, onAddToCart }) => {
  // usa artist_name; fallback a artist si algún doc antiguo no lo tiene
  const artist = vinyl.artist_name ?? vinyl.artist ?? "";

  // si cover_image es URL de página (Discogs/Bandcamp/Spotify),
  // usa el proxy del backend: /api/cover?url=...
const coverPage = vinyl.cover_image || vinyl.image;
const cover = coverPage ? `/api/cover?url=${encodeURIComponent(coverPage)}` : "/fallback.jpg";


  const price =
    typeof vinyl.price === "number"
      ? vinyl.price
      : Number(vinyl.price ?? vinyl.price_eur ?? 0) || 0;

  return (
    <div className="vinyl-card">
      <img src={cover} alt={vinyl.title} className="vinyl-image" />
      <div className="vinyl-info">
        <h3 className="vinyl-title">{vinyl.title}</h3>
        <p className="vinyl-artist">{artist}</p>
        {!!vinyl.genre && <p className="vinyl-genre">{vinyl.genre}</p>}
        <p className="vinyl-price">{price.toFixed(2)} €</p>

        <button
          className="add-cart-btn"
          onClick={() => onAddToCart?.(vinyl)}
        >
          Comprar
        </button>
      </div>
    </div>
  );
};

export default VinylCard;
