import React, { useEffect, useState } from "react";
import FoodCard from "./FoodCard";

export default function FoodList() {
  const [foods, setFoods] = useState([]);
  const url = "http://127.0.0.1:8000";

  const fetchFoods = async () => {
    try {
      const res = await fetch(`${url}/api/foods`, {
        credentials: "include",
        headers: { Accept: "application/json" },
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
