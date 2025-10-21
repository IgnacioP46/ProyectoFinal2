import { createContext, useState } from "react";
import api from "../api/axios";
export const AuthContext = createContext(null);

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };
  const logout = () => { localStorage.removeItem("token"); setUser(null); };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
