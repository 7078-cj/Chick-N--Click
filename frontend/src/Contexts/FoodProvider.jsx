import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import AuthContext from "./AuthContext";

export const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const { token, user } = useContext(AuthContext);

  const preUrl = import.meta.env.VITE_API_URL;   // Laravel API
  const wsUrl = import.meta.env.VITE_WS_URL;     // FastAPI WS

  const wsRef = useRef(null);

  // Load categories (initial fetch)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${preUrl}/api/category`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        setCategories(
          data.map((cat) => ({
            id: cat.id,
            name: cat.name,
            value: cat.id.toString(),
            label: cat.name,
          }))
        );
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    })();
  }, [token]);

  // Load foods initially
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${preUrl}/api/food`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setFoods(data);
      } catch (err) {
        console.error("Failed to load foods", err);
      }
    })();
  }, [token]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`${wsUrl}/ws/food/${user.id}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Connected to food WebSocket");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "food") {
          handleFoodEvent(msg);
        }
      } catch (err) {
        console.error("WebSocket message error", err);
      }
    };

    ws.onclose = () => {
      console.log("❌ Food WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, [token]);

  // Handle incoming food events
  const handleFoodEvent = (msg) => {
    const { event, food } = msg;

    setFoods((prevFoods) => {
      switch (event) {
        case "created":
          return [...prevFoods, food];
        case "updated":
          return prevFoods.map((f) => (f.id === food.id ? food : f));
        case "deleted":
          return prevFoods.filter((f) => f.id !== food.id);
        default:
          return prevFoods;
      }
    });
  };

  return (
    <FoodContext.Provider value={{ foods, setFoods, categories, setCategories }}>
      {children}
    </FoodContext.Provider>
  );
};
