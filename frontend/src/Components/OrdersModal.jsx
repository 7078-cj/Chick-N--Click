import React, { useContext, useEffect, useState } from "react";
import { Modal, Loader, Text, Card, Image } from "@mantine/core";
import AuthContext from "../Contexts/AuthContext";

export default function OrdersModal({ opened, onClose }) {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const url = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${url}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();

      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (opened) {
      fetchOrders();
    }
  }, [opened]);

  return (
    <Modal opened={opened} onClose={onClose} title="Your Orders" size="lg">
      {loading ? (
        <Loader />
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} shadow="sm" padding="lg" radius="md" withBorder>
              <Text fw={600}>
                Order #{order.id} - {order.status}
              </Text>
              <Text size="sm" c="dimmed">
                Placed on {new Date(order.created_at).toLocaleString()}
              </Text>

              <Text fw={500} mt="sm">
                Items:
              </Text>
              <div className="space-y-2 mt-2 w-50">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 border p-2 rounded-md"
                  >

                    <Image
                        src={
                            item.food.thumbnail
                            ? `${url}/storage/${item.food.thumbnail}`
                            : "https://via.placeholder.com/100x100?text=No+Image"
                        }
                        height={200}
                        className="object-cover w-full"
                    />
                    <div>
                      <Text fw={500}>{item.food.food_name}</Text>
                      <Text size="sm" c="dimmed">
                        Qty: {item.quantity} × ${item.price}
                      </Text>
                      <Text fw={600}>Subtotal: ${item.quantity * item.price}</Text>
                    </div>
                  </div>
                ))}
              </div>

              <Text fw={700} mt="sm" className="text-right">
                Total: ${order.total_price}
              </Text>
            </Card>
          ))}
        </div>
      ) : (
        <Text>No orders found.</Text>
      )}
    </Modal>
  );
}
