import React, { useContext, useState } from "react";
import { Card, Image, Text, Button, Modal, NumberInput } from "@mantine/core";
import FoodForm from "./FoodForm";
import AuthContext from "../Contexts/AuthContext";

export default function FoodCard({ food, url, onDelete, onUpdate }) {
  let { token, user } = useContext(AuthContext);
  const [opened, setOpened] = useState(false);
  const [cartOpened, setCartOpened] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!food) return null;

 
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this food?")) return;

    try {
      const res = await fetch(`${url}/api/foods/${food.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (onDelete) onDelete(food.id);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting.");
    }
  };

  
  const handleAddToCart = async () => {
    try {
      const res = await fetch(`${url}/api/cart/add/${food.id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

     
      const data = await res.json();
      setCartOpened(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while adding to cart.");
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder className="w-[300px]">
        {/* Thumbnail */}
        <Card.Section>
          <Image
            src={
              food.thumbnail
                ? `${url}/storage/${food.thumbnail}`
                : "https://via.placeholder.com/300x200?text=No+Image"
            }
            height={200}
            className="object-cover w-full"
          />
        </Card.Section>

        {/* Name */}
        <Text fw={700} size="lg" mt="md">
          {food.food_name || "Unnamed Food"}
        </Text>

        {/* Price & Availability */}
        <div className="flex justify-between items-center mt-2">
          <Text size="sm" c="dimmed">
            Price: ${food.price ?? 0}
          </Text>
          <Text
            size="sm"
            className={food.available ? "text-green-600" : "text-red-600"}
          >
            {food.available ? "Available" : "Not Available"}
          </Text>
        </div>

        {/* Description */}
        <Text size="sm" c="dimmed" mt="sm" lineClamp={3}>
          {food.description || "No description"}
        </Text>

        {/* Actions */}
        { user.role == "admin" ? 
          <div className="flex justify-between items-center mt-3">
            <Button size="xs" color="blue" onClick={() => setOpened(true)} radius="xl">
              Edit
            </Button>
            <Button size="xs" color="red" onClick={handleDelete} radius="xl">
              Delete
            </Button>
          </div>: 
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
        }
        

       
      </Card>

      {/* Edit Modal */}
      <Modal opened={opened} onClose={() => setOpened(false)} title="Edit Food" size="lg">
        <FoodForm food={food} onClose={() => setOpened(false)} onUpdate={onUpdate} />
      </Modal>

      {/* Quantity Modal for Cart */}
      <Modal
        opened={cartOpened}
        onClose={() => setCartOpened(false)}
        title={`Add ${food.food_name} to Cart`}
        centered
      >
        <NumberInput
          label="Quantity"
          value={quantity}
          min={1}
          onChange={setQuantity}
          required
        />
        <Button fullWidth mt="md" onClick={handleAddToCart}>
          Confirm Add
        </Button>
      </Modal>
    </>
  );
}
