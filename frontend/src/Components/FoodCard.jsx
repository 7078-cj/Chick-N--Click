import React, { useContext, useState } from "react";
import { Card, Image, Text, Button, Modal, NumberInput, Badge } from "@mantine/core";
import FoodForm from "./FoodForm";
import AuthContext from "../Contexts/AuthContext";

export default function FoodCard({ food, url, onDelete, onUpdate }) {
  const { token, user } = useContext(AuthContext);
  const [opened, setOpened] = useState(false);
  const [cartOpened, setCartOpened] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!food) return null;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this food?")) return;
    try {
      await fetch(`${url}/api/foods/${food.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (onDelete) onDelete(food.id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete food.");
    }
  };

  const handleAddToCart = async () => {
    try {
      await fetch(`${url}/api/cart/add/${food.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });
      setCartOpened(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart.");
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder className="w-[300px]">
        <Card.Section>
          <Image
            src={
              food.thumbnail
                ? `${url}/storage/${food.thumbnail}`
                : "https://via.placeholder.com/300x200?text=No+Image"
            }
            height={200}
            className="object-cover"
          />
        </Card.Section>

        <Text fw={700} size="lg" mt="md">
          {food.food_name}
        </Text>

        <div className="flex justify-between mt-2">
          <Text size="sm" c="dimmed">Price: ${food.price}</Text>
          <Text size="sm" className={food.available ? "text-green-600" : "text-red-600"}>
            {food.available ? "Available" : "Not Available"}
          </Text>
        </div>

        {/* Categories */}
        {food.categories?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {food.categories.map((c) => (
              <Badge key={c.id} color="teal" size="sm">{c.name}</Badge>
            ))}
          </div>
        )}

        <Text size="sm" c="dimmed" mt="sm" lineClamp={3}>
          {food.description}
        </Text>

        {/* Actions */}
        {user.role === "admin" ? (
          <div className="flex justify-between mt-3">
            <Button size="xs" color="blue" onClick={() => setOpened(true)} radius="xl">
              Edit
            </Button>
            <Button size="xs" color="red" onClick={handleDelete} radius="xl">
              Delete
            </Button>
          </div>
        ) : (
          <div className="mt-3">
            <Button
              size="sm"
              color="teal"
              radius="xl"
              fullWidth
              onClick={() => setCartOpened(true)}
              disabled={!food.available}
            >
              Add to Cart
            </Button>
          </div>
        )}
      </Card>

      {/* Edit Modal */}
      <Modal opened={opened} onClose={() => setOpened(false)} title="Edit Food" size="lg">
        <FoodForm food={food} onSuccess={onUpdate} onClose={() => setOpened(false)} />
      </Modal>

      {/* Quantity Modal */}
      <Modal opened={cartOpened} onClose={() => setCartOpened(false)} title={`Add ${food.food_name} to Cart`} centered>
        <NumberInput label="Quantity" value={quantity} min={1} onChange={setQuantity} required />
        <Button fullWidth mt="md" onClick={handleAddToCart}>
          Confirm Add
        </Button>
      </Modal>
    </>
  );
}
