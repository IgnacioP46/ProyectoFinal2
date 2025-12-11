import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login"; // Asegúrate de importar Login
import Register from "./pages/Register"; // Asegúrate de importar Register
import Checkout from "./pages/Checkout"; // Tu nuevo componente
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App es el contenedor principal
    children: [
      { index: true, element: <Home /> },
      { path: "cart", element: <Cart /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "checkout", element: <Checkout /> }, // Aquí está tu checkout
      { path: "profile", element: <Profile /> },
      { path: "admin", element: <AdminDashboard /> },
    ],
  },
]);

export default router;