import React, { useState, useEffect, useContext, useRef } from 'react';
import { Search, ShoppingCart, Filter, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';

// --- ESTILOS ---
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0b141a",
    color: "#e9edef",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "40px 0",
    overflowX: "hidden"
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    padding: "0 5%"
  },
  title: {
    fontSize: "3rem",
    fontWeight: "800",
    color: "#e9edef",
    marginBottom: "20px",
  },
  searchBox: {
    position: "relative",
    maxWidth: "600px",
    margin: "0 auto",
  },
  input: {
    width: "100%",
    padding: "15px 20px 15px 50px",
    backgroundColor: "#202c33",
    border: "1px solid #2a3942",
    borderRadius: "50px",
    color: "white",
    fontSize: "1.1rem",
    outline: "none",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    boxSizing: "border-box"
  },
  iconSearch: {
    position: "absolute",
    left: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#8696a0",
  },
  // --- SECCIÓN GÉNEROS (SCROLL) ---
  genreSection: {
    marginBottom: "40px",
    display: "flex",
    flexDirection: "column",
    position: "relative"
  },
  genreHeader: {
    padding: "0 5%",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  genreTitle: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#e9edef",
    margin: 0
  },
  // Contenedor relativo para posicionar las flechas
  carouselWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  scrollContainer: {
    display: "flex",
    gap: "20px",
    overflowX: "auto",
    padding: "10px 5% 30px 5%", 
    scrollBehavior: "smooth",
    width: "100%",
    scrollbarWidth: "none",
  },
  // BOTONES DE SCROLL
  navBtn: {
    position: "absolute",
    top: "40%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(11, 20, 26, 0.8)",
    color: "#fff",
    border: "1px solid #2a3942",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
    transition: "all 0.2s",
  },
  navBtnLeft: {
    left: "10px",
  },
  navBtnRight: {
    right: "10px",
  },
  // --- GRID (BÚSQUEDA) ---
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "30px",
    padding: "0 5%"
  },
  // --- TARJETA ---
  card: {
    minWidth: "220px", 
    maxWidth: "220px",
    backgroundColor: "#202c33",
    borderRadius: "15px",
    overflow: "hidden",
    border: "1px solid #2a3942",
    transition: "transform 0.2s, box-shadow 0.2s",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  cardImg: {
    width: "100%",
    aspectRatio: "1/1",
    objectFit: "cover",
    borderBottom: "1px solid #2a3942",
  },
  cardBody: {
    padding: "15px",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: {
    fontSize: "1rem",
    fontWeight: "bold",
    margin: "0 0 5px 0",
    color: "#e9edef",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  cardArtist: {
    color: "#8696a0",
    fontSize: "0.85rem",
    marginBottom: "15px",
    flexGrow: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#00a884",
  },
  addBtn: {
    backgroundColor: "#00a884",
    color: "#111b21",
    border: "none",
    borderRadius: "50%",
    width: "35px",
    height: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  }
};

// --- SUB-COMPONENTE PARA CADA FILA DE GÉNERO ---
const GenreSection = ({ genre, vinyls, addToCart }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 600;
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div style={styles.genreSection}>
      <div style={styles.genreHeader}>
        <h2 style={styles.genreTitle}>{genre}</h2>
        <ChevronRight size={24} color="#00a884" />
      </div>

      <div style={styles.carouselWrapper}>
        {/* Botón Izquierda */}
        <button 
            onClick={() => scroll('left')} 
            style={{...styles.navBtn, ...styles.navBtnLeft}}
            title="Anterior"
        >
            <ChevronLeft size={24} />
        </button>

        {/* Contenedor Scroll */}
        <div style={styles.scrollContainer} className="hide-scrollbar" ref={scrollRef}>
          {vinyls.map((vinyl) => (
            <div 
                key={vinyl._id} 
                style={styles.card}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.5)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                }}
            >
              <Link to={`/vinyls/${vinyl._id}`}>
                <img src={vinyl.cover_image} alt={vinyl.title} style={styles.cardImg} />
              </Link>
              <div style={styles.cardBody}>
                <Link to={`/vinyls/${vinyl._id}`} style={{textDecoration: 'none'}}>
                    <h3 style={styles.cardTitle} title={vinyl.title}>{vinyl.title}</h3>
                </Link>
                <p style={styles.cardArtist}>{vinyl.artist_name}</p>
                <div style={styles.footer}>
                  <span style={styles.price}>{vinyl.price_eur} €</span>
                  <button onClick={() => addToCart(vinyl)} style={styles.addBtn} title="Añadir">
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
            style={{...styles.navBtn, ...styles.navBtnRight}}
            title="Siguiente"
        >
            <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function Catalogo() {
  const [vinyls, setVinyls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useContext(CartContext);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    api.get("/vinyls").then((res) => {
      setVinyls(res.data);
      const uniqueGenres = [...new Set(res.data.map(v => v.genre).filter(Boolean))];
      setGenres(uniqueGenres);
    });
  }, []);

  // Filtrado para búsqueda
  const filtered = vinyls.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.artist_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.genre && v.genre.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>Explorar Catálogo</h1>
        <div style={styles.searchBox}>
          <Search style={styles.iconSearch} />
          <input 
            style={styles.input} 
            placeholder="Buscar por artista, álbum o género..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* CONTENIDO */}
      {searchTerm ? (
        // MODO BÚSQUEDA: Grid
        <div style={styles.grid}>
            {filtered.length > 0 ? (
                filtered.map(vinyl => (
                    // Reutilizamos la lógica visual de tarjeta aquí directamente para el grid
                    <div key={vinyl._id} style={styles.card}>
                      <Link to={`/vinyls/${vinyl._id}`}>
                        <img src={vinyl.cover_image} alt={vinyl.title} style={styles.cardImg} />
                      </Link>
                      <div style={styles.cardBody}>
                        <h3 style={styles.cardTitle}>{vinyl.title}</h3>
                        <p style={styles.cardArtist}>{vinyl.artist_name}</p>
                        <div style={styles.footer}>
                          <span style={styles.price}>{vinyl.price_eur} €</span>
                          <button onClick={() => addToCart(vinyl)} style={styles.addBtn}><ShoppingCart size={18} /></button>
                        </div>
                      </div>
                    </div>
                ))
            ) : (
                <div style={{gridColumn: "1 / -1", textAlign: "center", color: "#8696a0", marginTop: "40px"}}>
                    <Filter size={64} style={{opacity: 0.5, marginBottom: "20px"}}/>
                    <h2>No encontramos coincidencias.</h2>
                </div>
            )}
        </div>
      ) : (
        // MODO NORMAL: Filas por Género con Botones
        <div>
            {genres.map(genre => {
                const genreVinyls = vinyls.filter(v => v.genre === genre);
                if (genreVinyls.length === 0) return null;

                return (
                    <GenreSection 
                        key={genre} 
                        genre={genre} 
                        vinyls={genreVinyls} 
                        addToCart={addToCart} 
                    />
                );
            })}
        </div>
      )}
      
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