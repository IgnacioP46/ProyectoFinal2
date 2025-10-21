import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register(){
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try{
      await api.post("/auth/register", values);
      alert("Usuario creado. Ya puedes iniciar sesión.");
      navigate("/login");
    } catch {
      alert("No se ha podido registrar. ¿El email ya existe?");
    }
  };

  return (
    <main style={{padding:24, maxWidth:420, margin:"0 auto"}}>
      <h1>Registro</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{display:"grid", gap:12}}>
        <label>
          Nombre
          <input {...register("name", { required:true })} placeholder="Tu nombre"
                 style={{width:"100%", padding:"10px", borderRadius:8, border:"1px solid #2a3a55"}}/>
        </label>
        <label>
          Email
          <input {...register("email", { required:true })} type="email" placeholder="tú@correo.com"
                 style={{width:"100%", padding:"10px", borderRadius:8, border:"1px solid #2a3a55"}}/>
        </label>
        <label>
          Contraseña
          <input {...register("password", { required:true, minLength:6 })} type="password" placeholder="mín. 6 caracteres"
                 style={{width:"100%", padding:"10px", borderRadius:8, border:"1px solid #2a3a55"}}/>
        </label>
        <button className="btn" type="submit">Crear cuenta</button>
      </form>
      <p style={{marginTop:12}}>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </main>
  );
}
