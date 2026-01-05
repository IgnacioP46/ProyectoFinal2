import React from 'react';
import { Instagram, Facebook, Twitter, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-background">
      <div className="footer-centered">

        {/* --- ZONA IZQUIERDA (Redes + Contacto) --- */}
        <div className="left-section">

          {/* 1. REDES SOCIALES (Apiladas verticalmente) */}
          <div className="socials-column">
            <a href="#" className="social-icon instagram"><Instagram size={18} /></a>
            <a href="#" className="social-icon facebook"><Facebook size={18} /></a>
            <a href="#" className="social-icon twitter"><Twitter size={18} /></a>
          </div>

          {/* 2. CONTACTO (Apilado verticalmente) */}
          <div className="contact-column">
            <div className="contact-item">
              <Phone size={14} className="text-purple-400" />
              <span>+34 912 345 678</span>
            </div>
            <a href="mailto:info@murmullorecords.com" className="contact-item link">
              <Mail size={14} className="text-purple-400" />
              <span>info@murmullorecords.com</span>
            </a>
          </div>

        </div>

        {/* --- ZONA DERECHA (Legal + Copyright) --- */}
        <div className="right-section">
          <p className="copyright">
            © {new Date().getFullYear()} Murmullo Records
          </p>
          <div className="legal-links">
            <a href="#">Aviso Legal</a>
            <a href="#">Privacidad</a>
            <a href="#">Cookies</a>
          </div>
        </div>

      </div>

      {/* --- ESTILOS CSS --- */}
      <style>{`
        /* FONDO TOTAL (De punta a punta de la pantalla) */
        .footer-background {
          width: 100%;
          background-color: #111827; /* Gris muy oscuro / Negro azulado (Estilo Navbar) */
          color: #e5e7eb; /* Texto gris claro */
          padding: 20px 0;
          margin-top: auto; /* Empuja el footer al final */
          border-top: 1px solid #374151; /* Borde sutil superior */
        }

        /* CONTENEDOR CENTRADO (Limita el ancho del contenido) */
        .footer-centered {
          max-width: 1100px; /* Ancho máximo estándar */
          margin: 0 auto;    /* Centrar el bloque en la pantalla */
          padding: 0 20px;   /* Margen lateral para que no toque los bordes en móviles */
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* --- Estilos internos (igual que antes) --- */
        .left-section {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .socials-column {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .social-icon {
          color: #9ca3af;
          transition: 0.2s;
        }
        .social-icon:hover { color: white; transform: scale(1.1); }
        .social-icon.instagram:hover { color: #ec4899; }
        .social-icon.facebook:hover { color: #3b82f6; }
        .social-icon.twitter:hover { color: #0ea5e9; }

        .contact-column {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.85rem;
          border-left: 1px solid #4b5563; /* Separador gris oscuro */
          padding-left: 15px;
          color: #d1d5db;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .contact-item.link:hover { color: #a78bfa; text-decoration: underline; }

        .right-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .copyright {
          font-weight: bold;
          color: #fcfcfcff;
          font-size: 0.9rem;
        }

        .legal-links {
          display: flex;
          gap: 15px;
          color: #fcfcfcff;
        }
        .legal-links a:hover { color: #a78bfa; }

        /* Responsive Móvil */
        @media (max-width: 640px) {
          .footer-centered {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }
          .right-section {
            align-items: flex-start;
            width: 100%;
            border-top: 1px solid #374151;
            padding-top: 10px;
          }
        }
      `}</style>
    </footer>
  );
}