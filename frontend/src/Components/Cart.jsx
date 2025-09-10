import React, { useContext, useEffect, useState } from "react";
import { Text, Loader } from "@mantine/core";
import AuthContext from "../Contexts/AuthContext";
import CartItemCard from "./CartItemCard";

export default function Cart() {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const url = import.meta.env.VITE_API_URL

  // Fetch cart
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${url}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCart(data.cart || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      alert("Error loading cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity in state
  const handleUpdate = (foodId, newQty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.food_id === foodId ? { ...item, quantity: newQty, subtotal: newQty * item.price } : item
      )
    );
    setTotal((prev) => cart.reduce((sum, i) => sum + i.subtotal, 0));
  };

  // Remove item
  const handleRemove = (foodId) => {
    setCart((prev) => prev.filter((item) => item.food_id !== foodId));
    setTotal((prev) => cart.reduce((sum, i) => sum + i.subtotal, 0));
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4">
      <Text fw={700} size="xl" mb="lg">
        Your Cart
      </Text>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cart.length > 0 ? (
          cart.map((item) => (
            <CartItemCard
              key={item.food_id}
              item={item}
              url={url}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
            />
          ))
        ) : (
          <Text>No items in cart</Text>
        )}
      </div>

      <div className="mt-6 text-right">
        <Text fw={700} size="lg">
          Total: ${total}
        </Text>
      </div>
    </div>
  );
}
