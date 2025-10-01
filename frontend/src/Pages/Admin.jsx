import React, { useState } from "react";
import FoodList from "../Components/FoodList";
import AdminOrders from "../Components/AdminOrders";
import CategoryForm from "../Components/CategoryForm";
import CategoryList from "../Components/CategoryList";
import Sidebar from "../Components/Sidebar";
import AddFood from "../Components/AddFood";

function Admin() {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="flex flex-row w-full bg-gray-100 p-6 gap-5">
      {/* Sidebar */}
      <div className="m-10">
        <Sidebar setActiveTab={setActiveTab}/>
      </div>

      {/* Main Content */}
      <div className="w-full">
       
        

        {/* Panels */}
        {activeTab === "foods" && (
          <div className="flex flex-row mt-4 min-h-screen w-full">
            <FoodList className="flex-1 overflow-auto" />
            
            <div className="flex flex-col sticky bottom-10">
              <AddFood />
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 min-h-screen">
            <div className="bg-white shadow-md rounded-md p-4">
              <CategoryForm onSuccess={() => window.location.reload()} />
            </div>
            <div className="md:col-span-2 bg-white shadow-md rounded-md p-4">
              <CategoryList />
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white shadow-md rounded-md p-4 mt-4 min-h-screen">
            <h4 className="text-lg font-semibold mb-4">📦 Manage Orders</h4>
            <AdminOrders />
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
