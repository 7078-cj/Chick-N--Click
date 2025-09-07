import React, { useState, useEffect } from "react";

export default function FoodForm({ food = null }) {
  const [formData, setFormData] = useState({
    food_name: "",
    price: "",
    available: true,
    description: "",
    thumbnail: null,
  });

  const [preview, setPreview] = useState(null);

  // Load existing food data if editing
  useEffect(() => {
    if (food) {
      setFormData({
        food_name: food.food_name || "",
        price: food.price || "",
        available: food.available || true,
        description: food.description || "",
        thumbnail: null,
      });

      // Show existing thumbnail if available
      if (food.thumbnail) {
        setPreview(food.thumbnail.startsWith("http") ? food.thumbnail : `http://127.0.0.1:8000/storage/${food.thumbnail}`);
      }
    }
  }, [food]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        if (formData.thumbnail) data.append("thumbnail", formData.thumbnail);
        data.append("food_name", formData.food_name);
        data.append("price", formData.price);
        data.append("available", formData.available ? 1 : 0); // ✅ boolean fix
        data.append("description", formData.description);

        const url = food
            ? `http://127.0.0.1:8000/api/foods/${food.id}`
            : "http://127.0.0.1:8000/api/foods";

        const method = food ? "POST" : "POST"; 
        if (food) data.append("_method", "PUT");

        try {
            const res = await fetch(url, {
            method,
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

            if (!food) {
            setFormData({
                food_name: "",
                price: "",
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


  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white shadow-lg rounded-2xl p-6 border">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {food ? "Update Food" : "Create Food"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Thumbnail Input */}
          <div>
            <label className="block font-medium">Thumbnail</label>
            <input
              type="file"
              name="thumbnail"
              onChange={handleChange}
              accept="image/*"
              className="mt-1 block w-full text-sm"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-3 h-32 w-32 object-cover rounded-lg border shadow-sm"
              />
            )}
          </div>

          {/* Food Name */}
          <div>
            <label className="block font-medium">Food Name</label>
            <input
              type="text"
              name="food_name"
              value={formData.food_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Available */}
          <div>
            <label className="block font-medium">Available</label>
            <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={(e) =>
                setFormData((prev) => ({
                    ...prev,
                    available: e.target.checked,
                }))
                }
                className="mt-1 h-4 w-4"
            />
            <span className="ml-2">{formData.available ? "Yes" : "No"}</span>
        </div>

          {/* Description */}
          <div>
            <label className="block font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 shadow-md"
          >
            {food ? "Update" : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
