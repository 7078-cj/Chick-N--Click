import React, { useState, useEffect } from "react";
import {
  Card,
  Text,
  TextInput,
  NumberInput,
  Checkbox,
  Textarea,
  Button,
  FileInput,
  Stack,
  Image,
} from "@mantine/core";

export default function FoodForm({ food = null, onSuccess }) {
  const [formData, setFormData] = useState({
    food_name: "",
    price: 0,
    available: true,
    description: "",
    thumbnail: null,
  });

  const [preview, setPreview] = useState(null);

  // Load existing food if editing
  useEffect(() => {
    if (food) {
      setFormData({
        food_name: food.food_name || "",
        price: food.price || 0,
        available: food.available ?? true,
        description: food.description || "",
        thumbnail: null,
      });

      if (food.thumbnail) {
        setPreview(
          food.thumbnail.startsWith("http")
            ? food.thumbnail
            : `http://127.0.0.1:8000/storage/${food.thumbnail}`
        );
      }
    }
  }, [food]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);
    data.append("food_name", formData.food_name);
    data.append("price", formData.price);
    data.append("available", formData.available ? 1 : 0);
    data.append("description", formData.description);

    const url = food
      ? `http://127.0.0.1:8000/api/foods/${food.id}`
      : "http://127.0.0.1:8000/api/foods";

    if (food) data.append("_method", "PUT");

    try {
      const res = await fetch(url, {
        method: "POST",
        body: data,
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error(errorData);
        throw new Error("Failed to save food");
      }

      alert(food ? "Food updated successfully!" : "Food created successfully!");
      if (onSuccess) onSuccess(); // callback to refresh list or close modal

      if (!food) {
        setFormData({
          food_name: "",
          price: 0,
          available: true,
          description: "",
          thumbnail: null,
        });
        setPreview(null);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };
  const url = "http://127.0.0.1:8000";

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card shadow="lg" padding="xl" radius="md" withBorder>
        <Text size="xl" weight={700} align="center" mb="md">
          {food ? "Update Food" : "Create Food"}
        </Text>

        <form onSubmit={handleSubmit}>
          <Stack spacing="md">
            {/* Thumbnail Input */}
            <FileInput
              label="Thumbnail"
              placeholder="Choose an image"
              accept="image/*"
              onChange={(file) => {
                setFormData((prev) => ({ ...prev, thumbnail: file }));
                setPreview(file ? URL.createObjectURL(file) : null);
              }}
            />

            {/* Image Preview */}
            {(preview || (food && food.thumbnail)) && (
                <div className="w-[200px] h-[200px] mx-auto mt-2 overflow-hidden rounded-lg border shadow-sm">
                    <Image
                    src={
                    food
                        ? `${url}/storage/${food.thumbnail}`
                        : preview
                    }
                    height={200}
                    className="object-cover w-full"
                />
                </div>
                )}
            {/* Food Name */}
            <TextInput
              label="Food Name"
              placeholder="Enter food name"
              required
              value={formData.food_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, food_name: e.target.value }))
              }
            />

            {/* Price */}
            <NumberInput
              label="Price"
              placeholder="Enter price"
              required
              min={0}
              value={formData.price}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, price: value ?? 0 }))
              }
            />

            {/* Available */}
            <Checkbox
              label="Available"
              checked={formData.available}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  available: e.currentTarget.checked,
                }))
              }
            />

            {/* Description */}
            <Textarea
              label="Description"
              placeholder="Enter description"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />

            {/* Submit Button */}
            <Button type="submit" fullWidth color="blue" radius="md">
              {food ? "Update Food" : "Create Food"}
            </Button>
          </Stack>
        </form>
      </Card>
    </div>
  );
}
