import React, { useContext, useEffect, useState } from "react";
import FoodCard from "./FoodCard";
import AuthContext from "../Contexts/AuthContext";
import { FoodContext } from "../Contexts/FoodProvider";
import { CartContext } from "../Contexts/CartProvider";
import { SegmentedControl } from "@mantine/core";

export default function FoodList() {
  const { 
    setFoods, 
    foods, 
    categories, 
    searchQuery,
    filteredFoods: searchFilteredFoods 
  } = useContext(FoodContext);
  const { fetchCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  const url = import.meta.env.VITE_API_URL;

  const [displayFoods, setDisplayFoods] = useState([]);
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

  const handleAddToCart = async (food, quantity, close, sides, drinks) => {
    try {
      const res = await fetch(`${url}/api/cart/add/${food.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity, sides, drinks }),
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

  // Combined filter: search + category
  const applyFilters = () => {
    // Start with search-filtered foods from context
    let result = searchFilteredFoods;

    // Then apply category filter if not "all"
    if (activeCategory !== "all") {
      result = result.filter((f) =>
        f.categories?.some((c) => c.id.toString() === activeCategory)
      );
    }

    return result;
  };

  // Update displayed foods when search query or category changes
  useEffect(() => {
    setDisplayFoods(applyFilters());
  }, [searchFilteredFoods, activeCategory]);

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Show active search indicator */}
      {searchQuery && (
        <div className="mb-4 text-sm text-gray-600  px-4 py-2 rounded-lg">
          Searching for: <span className="font-semibold">"{searchQuery}"</span>
          <span className="ml-2 text-gray-500">
            ({displayFoods.length} result{displayFoods.length !== 1 ? 's' : ''})
          </span>
        </div>
      )}

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
        {displayFoods.length > 0 ? (
          displayFoods.map((food) => (
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
          <div className="text-center mt-6">
            <p className="text-gray-500">
              {searchQuery 
                ? `No foods found matching "${searchQuery}"${activeCategory !== "all" ? " in this category" : ""}`
                : "No foods found for this category."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}