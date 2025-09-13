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
} from "@mantine/core";
import AuthContext from "../Contexts/AuthContext";
import { FoodContext } from "../Contexts/FoodProvider";


export default function FoodForm({ food = null, onSuccess }) {
  const { setFoods,foods } = useContext(FoodContext);
  let { token } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    food_name: "",
    price: 0,
    available: true,
    description: "",
    thumbnail: null,
  });

  const [preview, setPreview] = useState(null);
  const preUrl = import.meta.env.VITE_API_URL

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

    const url = food
      ? `${preUrl}/api/foods/${food.id}`
      : `${preUrl}/api/foods`;

    if (food) data.append("_method", "PUT");

    try {
      const res = await fetch(url, {
        method: "POST",
        body: data,
        credentials: "include",
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.error(errorData);
        throw new Error("Failed to save food");
      }

    
      if (onSuccess) onSuccess(); 

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
      if(res){
        food = await res.json()
        console.log(food)
        setFoods((prev) => {
            const exists = prev.find((f) => f.id === food.id);

            if (exists) {
             
              return prev.map((f) => (f.id === food.id ? food : f));
            } else {
            
              return [...prev, food];
            }
          });
          console.log(foods)
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };
  const url = import.meta.env.VITE_API_URL;

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
                  available: e.target.checked,
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
