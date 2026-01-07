import React, { useEffect, useState, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Disc, Music, Star, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import heroImage from "../assets/hero-image.png";
const styles = {
  container: {
    fontFamily: "'Segoe UI', sans-serif",
    color: '#e9edef',
    backgroundColor: '#0b141a',
    minHeight: '100vh',
    paddingBottom: '50px'
  },
  // --- HERO SECTION ---
  hero: {
    position: 'relative',
    height: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundImage: 'url("' + heroImage + '")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(11, 20, 26, 0.7)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    padding: '20px',
    maxWidth: '800px',
  },
  title: {
    fontSize: '4rem',
    fontWeight: '800',
    marginBottom: '20px',
    background: 'linear-gradient(90deg, #fff, #00a884)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1.5rem',
    marginBottom: '40px',
    color: '#d1d7db',
  },
  ctaButton: {
    backgroundColor: '#00a884',
    color: '#0b141a',
    padding: '15px 40px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    borderRadius: '50px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 15px rgba(0, 168, 132, 0.4)',
  },
  
  // --- SECCIÓN SLIDER DESTACADOS ---
  sliderSection: {
    padding: '60px 5%',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '30px',
    borderLeft: '5px solid #00a884',
    paddingLeft: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sliderContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  scrollTrack: {
    display: 'flex',
    gap: '20px',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    padding: '20px 5px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  scrollButton: {
    backgroundColor: 'rgba(32, 44, 51, 0.8)',
    color: '#00a884',
    border: '1px solid #2a3942',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'absolute',
    zIndex: 10,
    transition: 'all 0.3s',
  },
  // --- TARJETA DE VINILO ---
  card: {
    minWidth: '250px',
    maxWidth: '250px',
    backgroundColor: '#202c33',
    borderRadius: '15px',
    overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s',
    border: '1px solid #2a3942',
    display: 'flex',
    flexDirection: 'column',
  },
  cardImg: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
  },
  cardBody: {
    padding: '15px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '5px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: '#e9edef',
    textDecoration: 'none',
  },
  cardArtist: {
    color: '#8696a0',
    fontSize: '0.9rem',
    marginBottom: '15px',
  },
  cardFooter: {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#e9edef',
  },
  addBtn: {
    backgroundColor: '#00a884',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    color: '#0b141a',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },

  // --- VENTAJAS ---
  features: {
    padding: '40px 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    marginTop: '40px',
    borderTop: '1px solid #2a3942',
    paddingTop: '60px'
  },
  featureCard: {
    textAlign: 'center',
    padding: '20px'
  },
};

export default function Home() {
  const [vinyls, setVinyls] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const { addToCart } = useContext(CartContext);

  // Cargar vinilos al iniciar
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get('https://discosderizos.onrender.com/api/vinyls');
        // Cogemos solo los primeros 10 para "Destacados"
        setVinyls(res.data.slice(0, 10));
        setLoading(false);
      } catch (error) {
        console.error("Error cargando destacados:", error);
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Función para scroll horizontal
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div style={styles.container}>
      
      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div style={styles.overlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>Siente la Música</h1>
          <p style={styles.subtitle}>
            Descubre los vinilos más exclusivos. Desde clásicos del rock hasta las últimas novedades indie.
          </p>
          <Link to="/catalogo" style={styles.ctaButton}>
            Explorar Catálogo <ArrowRight size={24} />
          </Link>
        </div>
      </section>

      {/* --- SECCIÓN DESTACADOS (SLIDER) --- */}
      <section style={styles.sliderSection}>
        <div style={styles.sectionTitle}>
          <span>🔥 Novedades Destacadas</span>
          <Link to="/catalogo" style={{fontSize: '1rem', color: '#00a884', textDecoration: 'none'}}>Ver todos</Link>
        </div>

        {loading ? (
            <p style={{textAlign: 'center', color: '#8696a0'}}>Cargando éxitos...</p>
        ) : (
          <div style={styles.sliderContainer}>
            {/* Botón Izquierda */}
            <button 
                onClick={() => scroll('left')} 
                style={{...styles.scrollButton, left: '-25px'}}
            >
                <ChevronLeft size={24} />
            </button>

            {/* Pista de Scroll */}
            <div ref={scrollRef} style={styles.scrollTrack} className="hide-scrollbar">
              {vinyls.map((vinyl) => (
                <div key={vinyl._id} style={styles.card}>
                  <Link to={`/producto/${vinyl._id}`}>
                    <img 
                        src={vinyl.cover_image || vinyl.image || "https://via.placeholder.com/250"} 
                        alt={vinyl.title} 
                        style={styles.cardImg} 
                    />
                  </Link>
                  <div style={styles.cardBody}>
                    <Link to={`/producto/${vinyl._id}`} style={styles.cardTitle}>
                        {vinyl.title}
                    </Link>
                    <p style={styles.cardArtist}>{vinyl.artist_name || vinyl.artist}</p>
                    
                    <div style={styles.cardFooter}>
                        <span style={styles.price}>{vinyl.price_eur || vinyl.price} €</span>
                        <button 
                            style={styles.addBtn}
                            onClick={() => addToCart(vinyl)}
                            title="Añadir al carrito"
                        >
                            <ShoppingCart size={18} />
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Botón Derecha */}
            <button 
                onClick={() => scroll('right')} 
                style={{...styles.scrollButton, right: '-25px'}}
            >
                <ChevronRight size={24} />
            </button>
          </div>
        )}
      </section>

      {/* SECCIÓN DE VENTAJAS (Iconos) */}
      <section style={styles.features}>
        <div style={styles.featureCard}>
          <Disc size={40} color="#00a884" style={{marginBottom: '15px'}} />
          <h3 style={{fontWeight: 'bold', marginBottom: '10px'}}>Calidad Premium</h3>
          <p style={{color: '#8696a0'}}>Vinilos revisados uno a uno.</p>
        </div>
        <div style={styles.featureCard}>
          <Star size={40} color="#00a884" style={{marginBottom: '15px'}} />
          <h3 style={{fontWeight: 'bold', marginBottom: '10px'}}>Ediciones Raras</h3>
          <p style={{color: '#8696a0'}}>Joyas difíciles de encontrar.</p>
        </div>
        <div style={styles.featureCard}>
          <Music size={40} color="#00a884" style={{marginBottom: '15px'}} />
          <h3 style={{fontWeight: 'bold', marginBottom: '10px'}}>Pasión Musical</h3>
          <p style={{color: '#8696a0'}}>De coleccionistas para ti.</p>
        </div>
      </section>

      {/* Estilo para ocultar barra de scroll nativa */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>

    </div>
  );
}