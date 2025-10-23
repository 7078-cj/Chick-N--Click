import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import AuthContext from "./AuthContext";
import PayWithGcash from "../Components/PayWithGcash";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { token } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const url = import.meta.env.VITE_API_URL;

    const fetchCart = async () => {
        try {
        setLoading(true);
        const res = await fetch(`${url}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        setCart(data.cart || []);
        setTotal(data.total || 0);
        } catch (err) {
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCart();
        } else {
            
            setCart([]);
            setTotal(0);
        }
        }, [token]);


    const updateCartItem = async (foodId, newQty) => {
        try {
        const res = await fetch(`${url}/api/cart/${foodId}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ quantity: newQty }),
        });

        const data = await res.json();
        setCart(data.cart || []);
        setTotal(data.total || 0);
        } catch (err) {
        console.error(err);
        }
    };

    const removeCartItem = async (foodId) => {
        try {
        const res = await fetch(`${url}/api/cart/${foodId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setCart(data.cart || []);
        setTotal(data.total || 0);
        } catch (err) {
        console.error(err);
        }
    };

    const handleUpdate = (foodId, newQty) => {
        setCart((prev) =>
        prev.map((item) =>
            item.food_id === foodId
            ? { ...item, quantity: newQty, subtotal: newQty * item.price }
            : item
        )
        );
        setTotal((prev) =>
        cart.reduce(
            (sum, i) =>
            sum + (i.food_id === foodId ? newQty * i.price : i.subtotal),
            0
        )
        );
        updateCartItem(foodId, newQty);
    };

    const handleRemove = (foodId) => {
        setCart((prev) => prev.filter((item) => item.food_id !== foodId));
        setTotal((prev) =>
        cart
            .filter((i) => i.food_id !== foodId)
            .reduce((sum, i) => sum + i.subtotal, 0)
        );
        removeCartItem(foodId);
    };

    const placeOrder = async () => {
        if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
        }

        try {
        setPlacingOrder(true);
        const res = await fetch(`${url}/api/order/place`, {
            method: "POST",
            headers: {
            Authorization: `Bearer ${token}`,
            },
            credentials: "include",
        });

        
        const data = await res.json();
        console.log(data)
        
        
        
        setCart([]); 
        setTotal(0);

        PayWithGcash(data)
        } catch (err) {
        console.error(err);
        alert("Error placing order.");
        } finally {
        setPlacingOrder(false);
        }
    };
    
    const context ={
        fetchCart:fetchCart,
        cart:cart,
        total:total, 
        loading:loading, 
        placingOrder:placingOrder,
        placeOrder:placeOrder,
        handleUpdate:handleUpdate,
        handleRemove:handleRemove
    
    }

    return (
        <CartContext.Provider value={context}>
            {children}
        </CartContext.Provider>
    );
};
