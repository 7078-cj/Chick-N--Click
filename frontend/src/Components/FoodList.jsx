import React, { useContext, useEffect, useState } from "react";
import FoodCard from "./FoodCard";
import AuthContext from "../Contexts/AuthContext";
import { FoodContext } from "../Contexts/FoodProvider";
import { Tabs } from "@mantine/core";

export default function FoodList() {
  const { setFoods, foods, categories } = useContext(FoodContext);
  const url = import.meta.env.VITE_API_URL;
  let { token } = useContext(AuthContext);

  const [activeCategory, setActiveCategory] = useState("all");

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

  // 🔑 Filter foods by active category
  const filteredFoods =
    activeCategory === "all"
      ? foods
      : foods.filter((f) =>
          f.categories?.some((c) => c.id.toString() === activeCategory)
        );

  return (
    <div className="w-full">
      {/* Tabs for category filter */}
      <Tabs value={activeCategory} onChange={setActiveCategory} radius="md">
        <Tabs.List>
          <Tabs.Tab value="all">All</Tabs.Tab>
          {categories.map((cat) => (
            <Tabs.Tab key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs>

      {/* Food list */}
      <div className="flex flex-wrap gap-6 justify-center mt-10">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              url={url}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))
        ) : (
          <p className="text-gray-500 mt-6">No foods found for this category.</p>
        )}
      </div>
    </div>
  );
}
