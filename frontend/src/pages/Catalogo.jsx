import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import api from '../api/axios';
import VinylCard from '../components/VinylCard';

// --- ESTILOS ADAPTADOS (Full Width + Dark Mode) ---
const styles = {
  container: {
    width: "100%",               // Ocupar todo el ancho
    minHeight: "100vh",
    padding: "40px 4%",          // Padding lateral porcentual para pantallas grandes
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#0b141a",  // Fondo Oscuro
    color: "#e9edef",            // Texto Base Claro
    boxSizing: "border-box",     // Asegura que el padding no rompa el ancho
  },
  header: {
    marginBottom: "50px",
    textAlign: "center",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "800",
    color: "#e9edef",            // TÍTULO BLANCO
    marginBottom: "20px",
  },
  searchContainer: {
    position: "relative",
    maxWidth: "600px",
    margin: "0 auto",
  },
  searchInput: {
    width: "100%",
    padding: "15px 20px 15px 50px",
    borderRadius: "50px",
    border: "1px solid #2a3942",
    backgroundColor: "#202c33",
    color: "#e9edef",
    fontSize: "1rem",
    outline: "none",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#e9edef",            // TÍTULO SECCIÓN BLANCO
    marginBottom: "20px",
    paddingLeft: "15px",
    borderLeft: "5px solid #00a884",
    marginTop: "40px",
  },
  carouselContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    marginBottom: "30px",
  },
  carouselTrack: {
    display: "flex",
    gap: "20px",                 // Espacio entre discos
    overflowX: "auto",
    scrollBehavior: "smooth",
    padding: "10px 0",           // Pequeño padding vertical para sombras
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    width: "100%",
  },
  navButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Un poco transparente
    color: "#0b141a",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    fontSize: "1.8rem",
    cursor: "pointer",
    zIndex: 20,
    boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s, background-color 0.2s",
  },
};

const adapt = (v) => ({
  _id: v._id ?? v.id,
  title: v.title ?? "Sin título",
  artist_name: v.artist_name ?? v.artist ?? "Desconocido",
  cover_image: v.cover_image ?? "",
  price: typeof v.price === "number" ? v.price : Number(v.price ?? v.price_eur ?? 0) || 0,
  genre: v.genre || 'Varios'
});

// --- COMPONENTE INTERNO PARA CADA FILA (GENRE ROW) ---
const GenreRow = ({ genre, vinyls }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      // Ajustamos el scroll para que desplace un poco más al ser pantalla ancha
      const scrollAmount = window.innerWidth * 0.6;
      rowRef.current.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="animate-fade-in" style={{ marginBottom: "20px" }}>
      <h2 style={styles.sectionTitle}>
        {genre} <span style={{ fontSize: "1rem", color: "#8696a0", fontWeight: "normal" }}>({vinyls.length})</span>
      </h2>

      <div style={styles.carouselContainer}>
        {/* Botón Izquierda (Sticky al borde o flotante) */}
        <button
          onClick={() => scroll(-1)}
          style={{ ...styles.navButton, left: "-25px" }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-50%) scale(1.1)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(-50%) scale(1)"}
        >
          ❮
        </button>

        {/* Pista de Scroll */}
        <div ref={rowRef} style={styles.carouselTrack} className="hide-scrollbar">
          {vinyls.map((vinyl) => (
            <VinylCard key={vinyl._id} vinyl={vinyl} />
          ))}
        </div>

        {/* Botón Derecha */}
        <button
          onClick={() => scroll(1)}
          style={{ ...styles.navButton, right: "-25px" }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-50%) scale(1.1)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(-50%) scale(1)"}
        >
          ❯
        </button>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL CATALOG ---
const Catalog = () => {
  const [vinyls, setVinyls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVinyls = async () => {
      try {
        const { data } = await api.get('/vinyls');
        const list = (Array.isArray(data) ? data : []).map(adapt);
        setVinyls(list);
      } catch (error) {
        console.error("Error al cargar vinilos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVinyls();
  }, []);

  // Filtros
  const filteredVinyls = vinyls.filter(vinyl =>
    vinyl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vinyl.artist_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const genres = [...new Set(filteredVinyls.map(v => v.genre))];

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: "#00a884", fontSize: "1.2rem" }}>Cargando catálogo...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* --- CABECERA --- */}
      <div style={styles.header}>
        <h1 style={styles.title}>Catálogo Completo</h1>
        <div style={styles.searchContainer}>
          <div style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#a0aec0" }}>
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Busca por artista, disco o género..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = "#00a884"}
            onBlur={(e) => e.target.style.borderColor = "#2a3942"}
          />
        </div>
      </div>

      {/* --- LISTADO POR GÉNEROS --- */}
      <div>
        {filteredVinyls.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#8696a0" }}>
            <p style={{ fontSize: "3rem", marginBottom: "20px" }}>🤔</p>
            <p style={{ fontSize: "1.5rem" }}>No se encontraron vinilos.</p>
          </div>
        ) : (
          genres.map((genre) => (
            <GenreRow
              key={genre}
              genre={genre}
              vinyls={filteredVinyls.filter(v => v.genre === genre)}
            />
          ))
        )}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-fade-in { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Catalog;