import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import {
  Card,
  Image,
  Loader,
  Text,
  Badge,
  Button,
  SegmentedControl,
  TextInput,
  Select,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

function AdminOrders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const url = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${url}/api/orders/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders || data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const res = await fetch(`${url}/api/order/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      const data = await res.json();

      // Update UI instantly
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: data.order.status } : o
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusColors = {
    pending: "yellow",
    approved: "blue",
    declined: "red",
    completed: "green",
    cancelled: "gray",
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch =
      order.id.toString().includes(search.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <SegmentedControl
          value={filter}
          onChange={setFilter}
          data={[
            { label: "All", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Declined", value: "declined" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
          ]}
        />
        <TextInput
          placeholder="Search by ID or customer..."
          icon={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          className="w-full md:w-72"
        />
      </div>

      {/* Orders */}
      {loading ? (
        <Loader />
      ) : filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <Card
              key={order.id}
              shadow="md"
              padding="lg"
              radius="md"
              withBorder
              className="hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <Text fw={600}>Order #{order.id}</Text>
                <Badge color={statusColors[order.status]} size="lg">
                  {order.status.toUpperCase()}
                </Badge>
              </div>

              <Text size="sm" c="dimmed">
                {new Date(order.created_at).toLocaleString()}
              </Text>
              <Text fw={500} mt="sm">
                Customer: {order.user?.name || "Unknown"}
              </Text>

              {/* Items */}
              <div className="mt-3 space-y-2 max-h-32 overflow-y-auto pr-1">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 border-b pb-1"
                  >
                    {/* Thumbnail */}
                    <div>
                        <Image
                            src={
                                item.food.thumbnail
                                ? `${url}/storage/${item.food.thumbnail}`
                                : "https://via.placeholder.com/40x40?text=No+Img"
                            }
                            
                            fit="cover"
                            radius="sm"
                            className="h-20 w-20 object-cover"
                            />
                    </div>
                    
                    {/* Food name + qty */}
                    <div className="flex-1 px-2">
                      <Text size="sm" fw={500}>
                        {item.food.food_name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Qty: {item.quantity}
                      </Text>
                    </div>
                    {/* Price */}
                    <Text size="sm">${item.quantity * item.price}</Text>
                  </div>
                ))}
              </div>

              {/* Total */}
              <Text fw={700} mt="sm" className="text-right text-green-700">
                Total: ${order.total_price}
              </Text>

              {/* Actions */}
              <div className="flex justify-between mt-4 items-center">
                <Button size="xs" variant="light" color="blue">
                  See Details
                </Button>

                {/* If cancelled, disable updates */}
                {order.status === "cancelled" ? (
                  <Button size="xs" color="gray" disabled>
                    Cancelled
                  </Button>
                ) : (
                  <Select
                    size="xs"
                    placeholder="Update status"
                    data={["pending", "approved", "declined", "completed"]}
                    value={order.status}
                    onChange={(value) => updateStatus(order.id, value)}
                  />
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Text>No orders found.</Text>
      )}
    </div>
  );
}

export default AdminOrders;
