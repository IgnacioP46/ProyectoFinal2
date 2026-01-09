import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Check, Disc, ArrowLeft, Calendar, Music } from "lucide-react";
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
    <div className="product-page-container">
      {/* Botón Volver fuera de la tarjeta */}
      <div className="back-btn-wrapper">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={20} /> Volver
        </button>
      </div>

      {/* LA "SUPER TARJETA" QUE UNIFICA EL ESTILO */}
      <div className="product-card-expanded">
        
        {/* Columna Izquierda: Imagen (Vinilo) */}
        <div className="product-img-section">
            <div className="vinyl-wrapper">
                <img 
                    src={vinyl.cover_image || "https://via.placeholder.com/400"} 
                    alt={vinyl.title} 
                    className="product-cover spin-animation"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=No+Image"; }}
                />
                <div className="vinyl-hole"></div>
            </div>
        </div>

        {/* Columna Derecha: Información */}
        <div className="product-info-section">
            <div className="product-header">
                <h1 className="product-title">{vinyl.title}</h1>
                <h2 className="product-artist">{vinyl.artist_name}</h2>
            </div>

            {/* Badges de información (Estilo Catálogo) */}
            <div className="product-badges">
                <span className="info-badge">
                    <Music size={16} /> {vinyl.genre || "General"}
                </span>
                <span className="info-badge">
                    <Calendar size={16} /> {vinyl.year || "N/A"}
                </span>
            </div>

            <p className="product-description">
                {vinyl.description || "Una joya musical lista para girar en tu tocadiscos."}
            </p>

            <div className="product-footer">
                <div className="price-stock-block">
                    <span className="big-price">{Number(vinyl.price_eur).toFixed(2)} €</span>
                    {vinyl.stock > 0 ? (
                        <span className="stock-text in-stock">
                            <Check size={16}/> En Stock ({vinyl.stock})
                        </span>
                    ) : (
                        <span className="stock-text out-stock">Agotado</span>
                    )}
                </div>

                <button 
                    onClick={handleBuy} 
                    disabled={vinyl.stock <= 0}
                    className={`buy-btn ${added ? 'btn-added' : ''}`}
                >
                    {added ? (
                        <>
                            <span className="btn-text">¡Añadido!</span> <Check size={24} />
                        </>
                    ) : (
                        <>
                            <span className="btn-text">Añadir al Carrito</span> 
                            <ShoppingCart size={24} />
                        </>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Product;