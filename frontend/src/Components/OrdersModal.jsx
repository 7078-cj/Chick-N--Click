import React, { useContext } from "react";
import {
  Modal,
  Loader,
  Text,
  Card,
  Image,
  Button,
  Badge,
  Group,
  Divider,
  Stack,
  Title,
} from "@mantine/core";
import { IconClock, IconShoppingBag, IconX } from "@tabler/icons-react";
import { OrderContext } from "../Contexts/Orderprovider";
import CartItemCard from "./CartItemCard";

export default function OrdersModal({ opened, onClose }) {
  const { cancelOrder, orders, loading } = useContext(OrderContext);
  const url = import.meta.env.VITE_API_URL;

  const statusColors = {
    pending: "yellow",
    approved: "blue",
    declined: "red",
    completed: "green",
    cancelled: "gray",
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3} >Your Orders</Title>}
      size="lg"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      centered
      
    >
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader color="blue" size="lg" />
        </div>
      ) : orders.length > 0 ? (
        <Stack spacing="md" className="w-full">
          {orders.map((order) => (
            <Card
              key={order.id}
              shadow="md"
              padding="lg"
              radius="md"
              withBorder
              className="hover:shadow-lg transition-all duration-200"
            >
              {/* Order header */}
              <Group position="apart" mb="xs">
                <Text fw={600} size="lg">
                  Order #{order.id}
                </Text>
                <Badge
                  color={statusColors[order.status]}
                  size="lg"
                  radius="md"
                  variant="filled"
                >
                  {order.status.toUpperCase()}
                </Badge>
              </Group>

              <Text size="sm" c="dimmed">
                Placed on {new Date(order.created_at).toLocaleString()}
              </Text>

              {/* Estimated time */}
              {order.estimated_time_of_completion > 0 && (
                <Group mt="xs">
                  <Badge
                    size="lg"
                    color="teal"
                    leftSection={<IconClock size={16} />}
                    radius="lg"
                  >
                    {order.estimated_time_of_completion} min ETA
                  </Badge>
                </Group>
              )}

              <Divider my="sm" />

              {/* Order type */}
              {order.type && (
                <Group align="center" spacing="xs">
                  <IconShoppingBag size={18} />
                  <Text fw={500}>Order Type:</Text>
                  <Text>{order.type}</Text>
                </Group>
              )}

              {/* Items */}
              <Stack spacing="xs" mt="md">
                {order.items.map((item, index) => (
                  <CartItemCard
                    key={index}
                    item={item}
                    url={url}
                    isOrder
                    orderId={order.id}
                  />
                ))}
              </Stack>

              <Divider my="sm" />

              {/* Footer Section */}
              <Group position="apart" align="center" mt="sm">
                <Text fw={600} size="md">
                  Total: ${order.total_price}
                </Text>

                <Group spacing="xs">
                  {order.status === "pending" && (
                    <Button
                      color="red"
                      size="xs"
                      variant="light"
                      leftSection={<IconX size={14} />}
                      onClick={() => cancelOrder(order.id)}
                    >
                      Cancel Order
                    </Button>
                  )}
                </Group>
              </Group>
            </Card>
          ))}
        </Stack>
      ) : (
        <Text align="center" c="dimmed">
          No orders found.
        </Text>
      )}
    </Modal>
  );
}
