// frontend/src/pages/Login.jsx
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || "/";

  const onSubmit = async (values) => {
    try {
      await login(values.email, values.password);
      navigate(redirectTo);
    } catch {
      alert("Credenciales inválidas");
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 420, margin: "0 auto" }}>
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "grid", gap: 12 }}>
        <label>
          Email
          <input {...register("email", { required: true })} type="email" placeholder="tú@correo.com"
            style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #2a3a55" }} />
        </label>
        <label>
          Contraseña
          <input {...register("password", { required: true })} type="password" placeholder="••••••••"
            style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #2a3a55" }} />
        </label>
        <button className="btn" type="submit">Entrar</button>
      </form>
      <p style={{ marginTop: 12 }}>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
    </main>
  );
}
