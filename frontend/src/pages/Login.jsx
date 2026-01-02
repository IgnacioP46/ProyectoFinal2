import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// ESTILOS COMUNES PARA LOGIN Y REGISTER
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0b141a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    backgroundColor: "#202c33",
    padding: "40px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "420px",
    border: "1px solid #2a3942",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  title: {
    color: "#e9edef",
    fontSize: "2rem",
    marginBottom: "30px",
    textAlign: "center",
    fontWeight: "bold",
  },
  inputGroup: { marginBottom: "20px" },
  label: { display: "block", color: "#8696a0", marginBottom: "8px", fontSize: "0.9rem" },
  input: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#111b21",
    border: "1px solid #2a3942",
    borderRadius: "8px",
    color: "white",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#00a884",
    color: "#111b21",
    fontWeight: "bold",
    border: "none",
    borderRadius: "50px",
    fontSize: "1.1rem",
    cursor: "pointer",
    marginTop: "10px",
  },
  linkText: {
    textAlign: "center",
    marginTop: "20px",
    color: "#8696a0",
    fontSize: "0.9rem",
  },
  link: { color: "#00a884", textDecoration: "none", fontWeight: "bold" }
};

export default function Login() {
  const { login } = useContext(AuthContext);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      await login(values.email, values.password);
      navigate("/");
    } catch { alert("Credenciales inválidas"); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Bienvenido</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input {...register("email", { required: true })} type="email" style={styles.input} placeholder="tu@email.com" />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <input {...register("password", { required: true })} type="password" style={styles.input} placeholder="••••••••" />
          </div>
          <button type="submit" style={styles.button}>Entrar</button>
        </form>
        <p style={styles.linkText}>
          ¿No tienes cuenta? <Link to="/register" style={styles.link}>Regístrate</Link>
        </p>
      </div>
    </div>
  );
}