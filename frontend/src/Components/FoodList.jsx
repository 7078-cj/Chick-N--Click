import React, { useContext, useEffect, useState } from "react";
import FoodCard from "./FoodCard";
import AuthContext from "../Contexts/AuthContext";
import { FoodContext } from "../Contexts/FoodProvider";



export default function FoodList() {
  const { setFoods, foods } = useContext(FoodContext);
  const url = import.meta.env.VITE_API_URL
  let { token } = useContext(AuthContext)

  const fetchFoods = async () => {
    try {
      const res = await fetch(`${url}/api/foods`, {
        credentials: "include",
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFoods(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleDelete = (id) => {
    setFoods((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpdate = (updatedFood) => {
    if (!updatedFood?.id) return;
    setFoods((prev) =>
      prev.map((f) => (f.id === updatedFood.id ? updatedFood : f))
    );
  };
  return (
    <div className="flex flex-wrap gap-6 justify-center mt-10">
      {foods.map((food) => (
        <FoodCard
          key={food.id}
          food={food}
          url={url}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
}
