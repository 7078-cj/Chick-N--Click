import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import AuthContext from "./AuthContext";

export const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const { token, user } = useContext(AuthContext);

  const preUrl = import.meta.env.VITE_API_URL;  
  const wsUrl = import.meta.env.VITE_WS_URL;     

  const wsRef = useRef(null);
  const hasLoadedRef = useRef(false); 
  // Load categories + foods once
  useEffect(() => {
    if (!token || hasLoadedRef.current) return;
    hasLoadedRef.current = true; // mark as loaded

    (async () => {
      try {
        // Fetch categories
        const catRes = await fetch(`${preUrl}/api/category`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const catData = await catRes.json();
        setCategories(
          catData.map((cat) => ({
            id: cat.id,
            name: cat.name,
            value: cat.id.toString(),
            label: cat.name,
          }))
        );

        // Fetch foods
        const foodRes = await fetch(`${preUrl}/api/foods`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const foodData = await foodRes.json();
        setFoods(foodData);
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    })();
  }, [token]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!token || !user) return;

    const ws = new WebSocket(`${wsUrl}/ws/food/${user.id}`);
    wsRef.current = ws;

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
  }, [token, user]);

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
