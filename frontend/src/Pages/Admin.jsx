import React from "react";
import FoodList from "../Components/FoodList";
import FoodForm from "../Components/FoodForm";
import AdminOrders from "../Components/AdminOrders";
import CategoryForm from "../Components/CategoryForm";
import CategoryList from "../Components/CategoryList";
import { Tabs, Card, Title } from "@mantine/core";

function Admin() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Card shadow="sm" radius="md" padding="lg" className="mb-6">
        <Title order={2}>👨‍🍳 Admin Dashboard</Title>
        <p className="text-gray-500 mt-1">
          Manage foods, categories, and customer orders in one place.
        </p>
      </Card>

      <Tabs defaultValue="foods" variant="pills" radius="md">
        <Tabs.List>
          <Tabs.Tab value="foods">🍔 Food Management</Tabs.Tab>
          <Tabs.Tab value="categories">📂 Categories</Tabs.Tab>
          <Tabs.Tab value="orders">📦 Orders</Tabs.Tab>
        </Tabs.List>

        {/* Food Management */}
        <Tabs.Panel value="foods" pt="xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <Card shadow="sm" radius="md" padding="lg">
              <Title order={4} className="mb-4">
                ➕ Add / Edit Food
              </Title>
              <FoodForm />
            </Card>
            <div className="md:col-span-2">
              <Card shadow="sm" radius="md" padding="lg">
                <Title order={4} className="mb-4">
                  📋 Food List
                </Title>
                <FoodList />
              </Card>
            </div>
          </div>
        </Tabs.Panel>

        {/* Category Management */}
        <Tabs.Panel value="categories" pt="xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <CategoryForm onSuccess={() => window.location.reload()} />
            <div className="md:col-span-2">
              <CategoryList />
            </div>
          </div>
        </Tabs.Panel>

        {/* Orders Management */}
        <Tabs.Panel value="orders" pt="xs">
          <Card shadow="sm" radius="md" padding="lg" className="mt-4">
            <Title order={4} className="mb-4">
              📦 Manage Orders
            </Title>
            <AdminOrders />
          </Card>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default Admin;
