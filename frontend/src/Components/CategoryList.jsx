import React, { useEffect, useState, useContext } from "react";
import { Card, Text, Button, TextInput, Group } from "@mantine/core";
import AuthContext from "../Contexts/AuthContext";

export default function CategoryList() {
  const { token } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const preUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${preUrl}/api/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await fetch(`${preUrl}/api/category/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${preUrl}/api/category/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName }),
      });

      if (!res.ok) throw new Error("Failed to update category");

      const updated = await res.json();
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );

      setEditingId(null);
      setEditName("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md">
      <Text fw={700} mb="md">📂 Categories</Text>
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="flex justify-between items-center border-b py-2"
        >
          {editingId === cat.id ? (
            <Group className="w-full">
              <TextInput
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1"
              />
              <Button size="xs" color="green" onClick={() => handleUpdate(cat.id)}>
                Save
              </Button>
              <Button size="xs" variant="light" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
            </Group>
          ) : (
            <>
              <Text>{cat.name}</Text>
              <Group>
                <Button size="xs" variant="light" onClick={() => handleEdit(cat)}>
                  Edit
                </Button>
                <Button
                  size="xs"
                  color="red"
                  variant="light"
                  onClick={() => handleDelete(cat.id)}
                >
                  Delete
                </Button>
              </Group>
            </>
          )}
        </div>
      ))}
    </Card>
  );
}
