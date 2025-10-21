import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Catalog from "./pages/Catalogo";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import App from "./App";

export default createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      { index: true, element: <Home/> },
      { path: "catalog", element: <Catalog/> },
      { path: "product/:id", element: <Product/> },
      { path: "cart", element: <Cart/> },
      { path: "checkout", element: <Checkout/> },
      { path: "login", element: <Login/> },
      { path: "register", element: <Register/> },
    ]
  }
]);
