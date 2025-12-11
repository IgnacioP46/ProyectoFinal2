import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem("cart");
        if (saved) setCart(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (vinyl) => {
        const exists = cart.find(i => i._id === vinyl._id);
        if (exists) {
            setCart(cart.map(i => i._id === vinyl._id ? { ...i, qty: i.qty + 1 } : i));
        } else {
            setCart([...cart, { ...vinyl, qty: 1 }]);
        }
    };

    const removeFromCart = (id) => setCart(cart.filter(i => i._id !== id));
    const clearCart = () => setCart([]);

    const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
};