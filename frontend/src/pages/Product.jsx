import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Check, Disc, ArrowLeft } from "lucide-react";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [vinyl, setVinyl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchVinyl = async () => {
      try {
        const res = await api.get(`/vinyls/${id}`);
        setVinyl(res.data);
      } catch (error) {
        console.error("Error cargando vinilo:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVinyl();
  }, [id]);

  const handleBuy = () => {
    addToCart(vinyl);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="loading-screen">Cargando disco...</div>;
  if (!vinyl) return <div className="error-screen">Producto no encontrado</div>;

  return (
    <div className="product-page">
      {/* Botón Volver */}
      <button onClick={() => navigate(-1)} className="back-btn">
        <ArrowLeft size={20} /> Volver
      </button>

      <div className="product-grid">
        {/* Columna Izquierda: Imagen */}
        <div className="product-image-container">
            <div className="vinyl-wrapper">
                <img 
                    src={vinyl.cover_image || "https://via.placeholder.com/400"} 
                    alt={vinyl.title} 
                    className="product-cover spin-animation"
                />
                {/* El agujero del vinilo */}
                <div className="vinyl-hole"></div>
            </div>
        </div>

        {/* Columna Derecha: Detalles */}
        <div className="product-details">
            <h1 className="product-title">{vinyl.title}</h1>
            <h2 className="product-artist">{vinyl.artist_name}</h2>

            <div className="product-meta">
                <span className="badge-genre"><Disc size={16} /> {vinyl.genre || "General"}</span>
                <span className="badge-year">{vinyl.year || "N/A"}</span>
                
                {vinyl.stock > 0 ? (
                    <span className="stock-status in-stock"><Check size={18}/> En Stock ({vinyl.stock})</span>
                ) : (
                    <span className="stock-status out-stock">Agotado</span>
                )}
            </div>

            <div className="product-price">{Number(vinyl.price_eur).toFixed(2)} €</div>
            <p className="product-description">{vinyl.description || "Sin descripción disponible."}</p>

            <button 
                onClick={handleBuy} 
                disabled={vinyl.stock <= 0}
                className={`buy-btn ${added ? 'btn-added' : ''}`}
            >
                {added ? (<>¡Añadido! <Check /></>) : (<>Añadir al Carrito <ShoppingCart /></>)}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Product;