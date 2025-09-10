import React from "react";
import FoodList from "../Components/FoodList";
import FoodForm from "../Components/FoodForm";

function Admin() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">👨‍🍳 Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Food Form (Add/Edit) */}
        <div className="md:col-span-1">
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Add / Edit Food</h2>
            <FoodForm />
          </div>
        </div>

        {/* Food List */}
        <div className="md:col-span-2">
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Food List</h2>
            <FoodList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
