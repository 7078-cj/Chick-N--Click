import React, { createContext, useState } from "react";

export const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);

  return (
    <FoodContext.Provider value={{ foods, setFoods }}>
      {children}
    </FoodContext.Provider>
  );
};