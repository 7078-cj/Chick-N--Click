import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import AuthContext from "./AuthContext";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const { token, user } = useContext(AuthContext); 
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const url = import.meta.env.VITE_API_URL;
    const wsUrl = import.meta.env.VITE_WS_URL; 

    const fetchOrders = async () => {
        try {
        setLoading(true);
        const res = await fetch(`${url}/api/orders`, {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders || []);
        } catch (err) {
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    const cancelOrder = async (orderId) => {
        if (!confirm("Are you sure you want to cancel this order?")) return;

        try {
        const res = await fetch(`${url}/api/order/${orderId}/cancel`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to cancel order");

        fetchOrders();
        } catch (err) {
        console.error(err);
        alert(err.message);
        }
    };

    useEffect(() => {
        if (!token || !user) return;
        const ws = new WebSocket(`${wsUrl}/ws/order/${user?.id}`);

        ws.onmessage = (event) => {
            try {
            const payload = JSON.parse(event.data);

            if (payload.type === "order" && payload.event === "update") {
                setOrders((prevOrders) =>
                prevOrders.map((o) =>
                    o.id === payload.order.id ? { ...o, ...payload.order } : o
                )
                );
            }
            } catch (err) {
            console.error("WebSocket message error:", err);
            }
        };

        ws.onerror = (err) => {
            console.error("WebSocket error:", err);
        };

        ws.onclose = () => {
            console.log("WebSocket closed");
        };

        return () => {
            ws.close();
        };
        
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchOrders();
        } else {
           
            setOrders([]);

        }
        }, [token]);

    
        const context ={ 
            fetchOrders,
            cancelOrder,
            orders,
            loading,
            setLoading
        }

    return (
        <OrderContext.Provider value={context}>
        {children}
        </OrderContext.Provider>
    );
};
