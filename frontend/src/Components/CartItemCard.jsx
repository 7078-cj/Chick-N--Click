import React, { useContext, useEffect, useState } from "react";
import { Card, Image, Text, Button, NumberInput } from "@mantine/core";
import AuthContext from "../Contexts/AuthContext";

export default function CartItemCard({ item, url, onUpdate, onRemove }) {
  const { token } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(item.quantity);


  useEffect(() => {
    if (quantity !== item.quantity) {
      const timeout = setTimeout(() => {
        handleUpdateQuantity(quantity);
      }, 500); 

      return () => clearTimeout(timeout);
    }
  }, [quantity]);


  const handleUpdateQuantity = async (newQty) => {
    try {
      const res = await fetch(`${url}/api/cart/add/${item.food_id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQty }),
      });

     
      await res.json();

    
      onUpdate(item.food_id, newQty);
    } catch (err) {
      console.error(err);
    }
  };


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

     
      const data = await res.json();

      onRemove(item.food_id);
      
    } catch (err) {
      console.error(err);
      alert("Error removing item.");
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="w-[350px] flex flex-col">
    
      <Card.Section>
        <Image
          src={item.thumbnail || "https://via.placeholder.com/150x100?text=No+Image"}
          height={150}
          alt={item.food_name}
          className="object-cover w-full"
        />
      </Card.Section>

     
      <Text fw={700} size="lg" mt="md">
        {item.food_name}
      </Text>
      <Text size="sm" c="dimmed">
        Price: ${item.price}
      </Text>
      <Text size="sm">Subtotal: ${item.subtotal}</Text>

      
      <div className="flex items-center gap-2 mt-2">
        <NumberInput
          value={quantity}
          onChange={setQuantity}
          min={1}
          style={{ flex: 1 }}
        />
      </div>

      
      <Button size="xs" color="red" mt="sm" onClick={handleRemove}>
        Remove
      </Button>
    </Card>
  );
}
