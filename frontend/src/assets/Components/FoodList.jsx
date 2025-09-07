import React, { useEffect, useState } from "react";
import FoodCard from "./FoodCard"; // import the FoodCard component

export default function FoodList() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://127.0.0.1:8000"; // your backend URL

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch(`${API_URL}/api/foods`, {
          credentials: "include", // if using cookies/auth
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch foods");

        const data = await res.json();
        setFoods(data);
      } catch (err) {
        console.error(err);
        setError("Could not load foods");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading foods...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {foods.map((food) => (
        <FoodCard key={food.id} food={food} url={API_URL} />
      ))}
    </div>
  );
}
