import { Link } from "react-router-dom"
import { useClock } from "../hooks/useClock"

export default function Navbar() {
  const { dateStr, timeStr } = useClock("Europe/Madrid")

  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <div style={styles.logo}>
        <h1 style={{ margin: 0 }}>Discos Rizos</h1>
      </div>

      {/* Links */}
      <ul style={styles.links}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/catalogo">Catálogo</Link></li>
        <li><Link to="/product">Product</Link></li>
        <li><Link to="/checkout">Checkout</Link></li>
      </ul>

      {/* Hora y fecha */}
      <div style={styles.clock}>
        <span>{timeStr}</span>
        <span>{dateStr}</span>
      </div>
    </nav>
  )
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#222",
    color: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logo: {
    fontSize: "1.25rem",
    fontWeight: "bold",
  },
  links: {
    listStyle: "none",
    display: "flex",
    gap: "1rem",
    margin: 0,
    padding: 0,
  },
  clock: {
    display: "flex",
    flexDirection: "column",
    textAlign: "right",
    fontSize: "0.9rem",
  },
}
