import React, { createContext, useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";

export const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const { token } = useContext(AuthContext);
  const preUrl = import.meta.env.VITE_API_URL;

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
            value: cat.id.toString(), // for Mantine Select
            label: cat.name,          // for Mantine Select
          }))
        );
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    })();
  }, [token]);

  return (
    <FoodContext.Provider value={{ foods, setFoods, categories, setCategories }}>
      {children}
    </FoodContext.Provider>
  );
};
