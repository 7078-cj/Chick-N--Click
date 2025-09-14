import React, { useState, useContext } from "react";
import { Card, TextInput, Button, Stack } from "@mantine/core";
import AuthContext from "../Contexts/AuthContext";

export default function CategoryForm({ onSuccess }) {
  let { token } = useContext(AuthContext);
  const [name, setName] = useState("");

  const preUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${preUrl}/api/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to create category");
      setName("");

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md">
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Category Name"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button type="submit" color="blue">
            Create Category
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
