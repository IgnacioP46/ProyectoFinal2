import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, MapPin, Home, Hash } from 'lucide-react';
import axios from 'axios';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b141a',
    color: '#e9edef',
    fontFamily: "'Segoe UI', sans-serif",
    padding: '40px 20px',
  },
  card: {
    backgroundColor: '#202c33',
    padding: '40px',
    borderRadius: '15px',
    width: '100%',
    maxWidth: '500px',
    border: '1px solid #2a3942',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '10px',
    color: '#00a884',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#8696a0',
    marginBottom: '30px',
  },
  sectionTitle: {
    color: '#e9edef',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginTop: '20px',
    marginBottom: '15px',
    borderBottom: '1px solid #2a3942',
    paddingBottom: '5px'
  },
  // Grid para inputs pequeños
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '15px',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#111b21',
    border: '1px solid #2a3942',
    borderRadius: '10px',
    padding: '12px',
    gap: '10px',
  },
  input: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    width: '100%',
    outline: 'none',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#00a884',
    color: '#111b21',
    border: 'none',
    width: '100%',
    padding: '15px',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '30px',
    transition: 'transform 0.2s',
  },
  link: {
    color: '#00a884',
    textDecoration: 'none',
    fontSize: '0.9rem',
    display: 'block',
    marginTop: '20px',
    textAlign: 'center',
  }
};

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    street: '', number: '', floor: '', zipCode: '', city: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ajusta la URL a tu backend real
      await axios.post('http://localhost:3000/api/auth/register', formData);
      alert('¡Cuenta creada con éxito! Ahora inicia sesión.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Crear Cuenta</h1>
        <p style={styles.subtitle}>Únete para comprar tus vinilos favoritos</p>
        
        <form onSubmit={handleSubmit}>
          
          {/* DATOS PERSONALES */}
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <User size={20} color="#8696a0" />
              <input name="name" placeholder="Nombre completo" required style={styles.input} onChange={handleChange} />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <Mail size={20} color="#8696a0" />
              <input name="email" type="email" placeholder="Correo electrónico" required style={styles.input} onChange={handleChange} />
            </div>
          </div>
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <Lock size={20} color="#8696a0" />
              <input name="password" type="password" placeholder="Contraseña" required style={styles.input} onChange={handleChange} />
            </div>
          </div>

          {/* DIRECCIÓN */}
          <h3 style={styles.sectionTitle}>Dirección de Envío</h3>
          
          <div style={styles.inputGroup}>
            <div style={styles.inputWrapper}>
              <MapPin size={20} color="#8696a0" />
              <input name="street" placeholder="Calle / Avenida" required style={styles.input} onChange={handleChange} />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputWrapper}>
              <Home size={20} color="#8696a0" />
              <input name="number" placeholder="Nº" required style={styles.input} onChange={handleChange} />
            </div>
            <div style={styles.inputWrapper}>
              <Hash size={20} color="#8696a0" />
              <input name="floor" placeholder="Piso" style={styles.input} onChange={handleChange} />
            </div>
            <div style={styles.inputWrapper}>
              <MapPin size={20} color="#8696a0" />
              <input name="zipCode" placeholder="CP" required style={styles.input} onChange={handleChange} />
            </div>
          </div>
          
          <div style={{...styles.inputWrapper, marginTop: '15px'}}>
              <MapPin size={20} color="#8696a0" />
              <input name="city" placeholder="Ciudad" required style={styles.input} onChange={handleChange} />
          </div>

          <button type="submit" style={styles.button}>Registrarse</button>
        </form>

        <Link to="/login" style={styles.link}>
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </div>
    </div>
  );
}