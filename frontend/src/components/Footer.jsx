import React from 'react';
import { Instagram, Facebook, Twitter, Mail, Phone, Heart } from 'lucide-react';
import { useClock } from '../hooks/useClock';
import '../index.css';

export default function Footer() {
    const time = useClock();

    return (
        <footer className="footer-background">
            <div className="footer-centered">

                {/* --- ZONA IZQUIERDA (Redes + Contacto) --- */ }
                <div className="left-section">
                    
                    {/* Redes Sociales Verticales */}
                    <div className="socials-column">
                        <a href="#" className="social-icon instagram"><Instagram size={20} color="#ffffffff" /></a>
                        <a href="#" className="social-icon facebook"><Facebook size={20} color="#ffffffff" /></a>
                        <a href="#" className="social-icon twitter"><Twitter size={20} color="#ffffffff" /></a>
                    </div>

                    {/* Contacto Vertical con borde a la izquierda */}
                    <div className="contact-column">
                        <div className="contact-item">
                            <Phone size={16} color="#00a884" />
                            <span>+34 912 345 678</span>
                        </div>
                        <a href="mailto:info@discosrizos.com" className="contact-item">
                            <Mail size={16} color="#00a884" />
                            <span>info@discosrizos.com</span>
                        </a>
                    </div>
                </div>

                {/* --- ZONA DERECHA (Copyright + Legal + Reloj) --- */}
                <div className="right-section">
                    <div className="footer-clock">
                        {time}
                    </div>
                    
                    <div style={{fontWeight: 'bold', color: 'white'}}>
                        © {new Date().getFullYear()} Discos Rizos
                    </div>
                    
                    <div className="legal-links">
                        <a href="#">Privacidad</a>
                        <a href="#">Cookies</a>
                        <a href="#">Términos</a>
                    </div>
                    
                    <div style={{fontSize: '0.8rem', color: '#666', marginTop: '5px'}}>
                        Hecho con <Heart size={10} inlinefill="true" />
                    </div>
                </div>

            </div>
        </footer>
    );
}