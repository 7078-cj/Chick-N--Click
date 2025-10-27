import React, { useContext, useEffect, useState } from "react";
import FoodCard from "./FoodCard";
import AuthContext from "../Contexts/AuthContext";
import { FoodContext } from "../Contexts/FoodProvider";
import { CartContext } from "../Contexts/CartProvider";
import { SegmentedControl } from "@mantine/core";

export default function FoodList() {
  const { setFoods, foods, categories } = useContext(FoodContext);
  const { fetchCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  const url = import.meta.env.VITE_API_URL;

  const [filteredFoods, setFilteredFoods] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  
  
  const data = [
    { label: "All", value: "all" },
    ...categories.map((c) => ({
      label: c.name,
      value: c.id.toString(),
    })),
  ];

  // Fetch foods
  const fetchFoods = async () => {
    try {
      const res = await fetch(`${url}/api/foods`, {
        credentials: "include",
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFoods(data);
    } catch (err) {
      console.error("Failed to fetch foods:", err);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const onDelete = (id) => setFoods((prev) => prev.filter((f) => f.id !== id));

  const handleUpdate = (updatedFood) => {
    if (!updatedFood?.id) return;
    setFoods((prev) => prev.map((f) => (f.id === updatedFood.id ? updatedFood : f)));
  };

  const handleDelete = async (food) => {
    if (!confirm("Are you sure you want to delete this food?")) return;
    try {
      await fetch(`${url}/api/foods/${food.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(food.id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete food.");
    }
  };

  const handleAddToCart = async (food, quantity, close) => {
    try {
      const res = await fetch(`${url}/api/cart/add/${food.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });
      if (res.ok) {
        fetchCart();
        close();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart.");
    }
  };

  
  const filterFoods = () => {
    if (activeCategory === "all") return foods;
    return foods.filter((f) =>
      f.categories?.some((c) => c.id.toString() === activeCategory)
    );
  };

  
  useEffect(() => {
    setFilteredFoods(filterFoods());
  }, [foods, activeCategory]);

  return (
    <div className="w-full">
      <SegmentedControl
        value={activeCategory}
        onChange={setActiveCategory}
        fullWidth
        radius="xl"
        color="orange"
        data={data}
        transitionDuration={200}
      />

      <div className="flex flex-wrap gap-6 justify-center mt-10">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              url={url}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              handleAddToCart={handleAddToCart}
            />
          ))
        ) : (
          <p className="text-gray-500 mt-6">No foods found for this category.</p>
        )}
      </div>
    </div>
  );
}
