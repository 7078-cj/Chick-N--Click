import React, { useContext, useState } from "react";
import { Card, Image, Text, Button, NumberInput } from "@mantine/core";
import AuthContext from "../Contexts/AuthContext";

export default function CartItemCard({ item, url, onUpdate, onRemove }) {
  const { token } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(item.quantity);

  // 🔹 Update quantity
  const handleUpdateQuantity = async () => {
    try {
      const res = await fetch(`${url}/api/cart/add/${item.food_id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) throw new Error("Failed to update quantity");
      const data = await res.json();
      onUpdate(item.food_id, quantity);
      
    } catch (err) {
      console.error(err);
     
    }
  };

  // 🔹 Remove item from cart
  const handleRemove = async () => {
    if (!confirm("Remove this item from cart?")) return;

    try {
      const res = await fetch(`${url}/api/cart/remove/${item.food_id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to remove item");
      const data = await res.json();
      onRemove(item.food_id);
      alert(data.message || "Item removed!");
    } catch (err) {
      console.error(err);
      alert("Error removing item.");
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="w-[350px] flex flex-col">
      {/* Thumbnail */}
      <Card.Section>
        <Image
          src={item.thumbnail || "https://via.placeholder.com/150x100?text=No+Image"}
          height={150}
          alt={item.food_name}
          className="object-cover w-full"
        />
      </Card.Section>

      {/* Info */}
      <Text fw={700} size="lg" mt="md">
        {item.food_name}
      </Text>
      <Text size="sm" c="dimmed">
        Price: ${item.price}
      </Text>
      <Text size="sm">Subtotal: ${item.subtotal}</Text>

      {/* Quantity Control */}
      <div className="flex items-center gap-2 mt-2">
        <NumberInput
          value={quantity}
          onChange={setQuantity}
          min={1}
          style={{ flex: 1 }}
        />
        <Button size="xs" color="blue" onClick={handleUpdateQuantity}>
          Update
        </Button>
      </div>

      {/* Remove */}
      <Button size="xs" color="red" mt="sm" onClick={handleRemove}>
        Remove
      </Button>
    </Card>
  );
}
