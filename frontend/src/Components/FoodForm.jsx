import React, { useState, useEffect, useContext } from "react";
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
  MultiSelect,
} from "@mantine/core";
import AuthContext from "../Contexts/AuthContext";
import { FoodContext } from "../Contexts/FoodProvider";

export default function FoodForm({ food = null, onSuccess, onClose }) {
  const { setFoods,categories } = useContext(FoodContext);
  const { token } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    food_name: "",
    price: 0,
    available: true,
    description: "",
    thumbnail: null,
    categories: [],
  });

  const [preview, setPreview] = useState(null);
  const preUrl = import.meta.env.VITE_API_URL;

  

  // Load food if editing
  useEffect(() => {
    if (food) {
      setFormData({
        food_name: food.food_name || "",
        price: food.price || 0,
        available: food.available ?? true,
        description: food.description || "",
        thumbnail: null,
        categories: food.categories?.map((c) => c.id.toString()) || [],
      });

      if (food.thumbnail) {
        setPreview(
          food.thumbnail.startsWith("http")
            ? food.thumbnail
            : `${preUrl}/storage/${food.thumbnail}`
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
    formData.categories.forEach((catId) => data.append("categories[]", catId));

    const url = food
      ? `${preUrl}/api/foods/${food.id}`
      : `${preUrl}/api/foods`;

    if (food) data.append("_method", "PUT");

    try {
      const res = await fetch(url, {
        method: "POST",
        body: data,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to save food");
      const savedFood = await res.json();


      if (onSuccess) onSuccess();
      if (onClose) onClose();

      if (!food) {
        setFormData({
          food_name: "",
          price: 0,
          available: true,
          description: "",
          thumbnail: null,
          categories: [],
        });
        setPreview(null);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6">
      <Card shadow="lg" padding="xl" radius="md" withBorder>
        <Text size="xl" fw={700} align="center" mb="md">
          {food ? "Update Food" : "Create Food"}
        </Text>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            {/* Thumbnail */}
            <FileInput
              label="Thumbnail"
              placeholder="Choose an image"
              accept="image/*"
              onChange={(file) => {
                setFormData((prev) => ({ ...prev, thumbnail: file }));
                setPreview(file ? URL.createObjectURL(file) : null);
              }}
            />
            {preview && (
              <div className="w-[200px] h-[200px] mx-auto overflow-hidden rounded-lg border shadow">
                <Image src={preview} height={200} className="object-cover" />
              </div>
            )}

            <TextInput
              label="Food Name"
              placeholder="Enter food name"
              required
              value={formData.food_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, food_name: e.target.value }))
              }
            />

            <NumberInput
              label="Price"
              required
              min={0}
              value={formData.price}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, price: val ?? 0 }))
              }
            />

            <Checkbox
              label="Available"
              checked={formData.available}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  available: e.target.checked,
                }))
              }
            />

            <Textarea
              label="Description"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />

            {/* Categories */}
            <MultiSelect
              data={categories}
              label="Categories"
              placeholder="Select categories"
              value={formData.categories}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, categories: value }))
              }
            />

            <Button type="submit" fullWidth color="blue" radius="md">
              {food ? "Update Food" : "Create Food"}
            </Button>
          </Stack>
        </form>
      </Card>
    </div>
  );
}
