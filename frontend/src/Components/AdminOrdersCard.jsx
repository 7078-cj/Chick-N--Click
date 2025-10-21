import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Text,
  Select,
  NumberInput,
  Button,
  Image,
  Group,
  Badge,
} from "@mantine/core";
import AuthContext from "../Contexts/AuthContext";

function AdminOrdersCard({ order, statusColors, updateStatus, setOrders }) {
  const url = import.meta.env.VITE_API_URL;
  const [etc, setEtc] = useState(order.estimated_time_of_completion || 0);
  const { token } = useContext(AuthContext);

  const updateETC = async () => {
    try {
      const res = await fetch(`${url}/api/order/${order.id}/etc`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ etc }),
      });

      if (!res.ok) throw new Error("Failed to update ETC");
      const data = await res.json();

      
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, estimated_time_of_completion: data.order.estimated_time_of_completion } : o
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error updating ETC");
    }
  };

    useEffect(() => {
  
        const delay = setTimeout(() => {
            if (etc > 0) {
            updateETC(); 
            console.log("Estimated completion time:", etc);
            }
        }, 1000);

        
        return () => clearTimeout(delay);
    }, [etc]);

  return (
    <Card
                  key={order.id}
                  withBorder
                  radius="md"
                  shadow="md"
                  p="lg"
                  style={{
                    borderLeft: `5px solid var(--mantine-color-${statusColors[order.status]}-6)`,
                  }}
                >
                  <Group justify="space-between" align="flex-start">
                    <div>
                      <Text fw={700} size="lg">
                        Order #{order.id}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {new Date(order.created_at).toLocaleString()}
                      </Text>
                      <Text fw={500}>
                        Customer:{" "}
                        <Text span c="orange.8">
                          {order.user?.name || "Unknown"}
                        </Text>
                      </Text>
                    </div>

                    <Badge
                      color={statusColors[order.status]}
                      variant="filled"
                      size="lg"
                    >
                      {order.status.toUpperCase()}
                    </Badge>
                     {order.status === "cancelled" ? (
                      <Button size="xs" color="gray" disabled>
                        Cancelled
                      </Button>
                    ) : (
                      <Select
                        size="sm"
                        placeholder="Update status"
                        data={["pending", "approved", "declined", "completed"]}
                        value={order.status}
                        onChange={(value) => updateStatus(order.id, value)}
                      />
                    )}

                    <div className="flex flex-row justify-center items-center">
                        <NumberInput
                        
                        placeholder="Estimated completion time"
                        min={0}
                        w={150}
                        value={etc}
                        onChange={setEtc}
                        />
                        <span>min</span>
                    </div>

                    <Text fw={700} c="green.7">
                      P{order.total_price.toFixed(2)}
                    </Text>
                  </Group>

                  <div className="w-full h-10"></div>

                  <Text fw={600} mb="xs">
                    Order Details:
                  </Text>
                  <div className="flex flex-row gap-4">
                    {order.items.map((item) => (
                      <div className="w-[5%] h-[5%]"
                      >
                        <Group align="center" gap="md">
                          <Image
                            src={
                              item.food.thumbnail
                                ? `${url}/storage/${item.food.thumbnail}`
                                : "https://via.placeholder.com/60x60?text=No+Img"
                            }
                            radius="md"
                            fit="cover"
                            width={20}
                            height={20}
                          />
                          <div>
                            <Text fw={500}>{item.food.food_name}</Text>
                            <Text size="sm" c="dimmed">
                              Qty: {item.quantity}
                            </Text>
                            <Text size="sm" fw={600} c="green.8">
                              P{item.quantity * item.price}
                            </Text>
                          </div>
                        </Group>
                      </div>
                    ))}
                  </div>
                </Card>
  );
}

export default AdminOrdersCard;
