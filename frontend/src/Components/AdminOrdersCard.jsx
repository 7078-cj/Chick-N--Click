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
  Modal,
  ScrollArea,
} from "@mantine/core";
import AuthContext from "../Contexts/AuthContext";
import UserLocationMap from "./LeafletMap";

function AdminOrdersCard({ order, statusColors, updateStatus, setOrders }) {
  const url = import.meta.env.VITE_API_URL;
  const { token } = useContext(AuthContext);
  const [etc, setEtc] = useState(order.estimated_time_of_completion || 0);
  const [opened, setOpened] = useState(false);
  const [location, setLocation] = useState({
    lat: order.user.latitude,
    lng: order.user.longitude,
    city: "",
    country: "",
    full: order.user.location,
  });

  // 🔹 Update ETC API
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
          o.id === order.id
            ? {
                ...o,
                estimated_time_of_completion:
                  data.order.estimated_time_of_completion,
              }
            : o
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error updating ETC");
    }
  };

  // 🔹 Debounce ETC updates
  useEffect(() => {
    const delay = setTimeout(() => {
      if (etc > 0) {
        updateETC();
      }
    }, 1000);
    return () => clearTimeout(delay);
  }, [etc]);

  return (
    <>
      {/* ================= CARD ================= */}
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
            <span className="ml-2">min</span>
          </div>

          <Text fw={700} c="green.7">
            ₱{order.total_price.toFixed(2)}
          </Text>
        </Group>

        {/* 🔹 View Details Button */}
        <div className="mt-6 flex justify-end">
          <Button variant="light" color="blue" onClick={() => setOpened(true)}>
            View Details
          </Button>
        </div>
      </Card>

      {/* ================= MODAL ================= */}
     <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        centered
        size="100%"
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <div className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-lg">
          
          {/* ================= PAYMENT SECTION ================= */}
          <div className=" bg-gray-50 p-6 rounded-lg shadow-md flex flex-col justify-between">
            {/* Map */}
            <div className="w-full h-64 rounded-lg overflow-hidden shadow-md mt-4">
              <UserLocationMap
                editMode={false}
                setLocation={setLocation}
                location={{
                  lat: parseFloat(order.user.latitude) || 14.5995,
                  lng: parseFloat(order.user.longitude) || 120.9842,
                  full: order.user.location || "No location provided",
                }}
                user={order.user}
              />
            </div>
            <Text fw={700} size="lg" className="mb-2">Payment Successful</Text>
            <Text size="sm" c="dimmed" mb={4}>
              Order has been successfully paid and verified via {order.payment_method || "GCash"}.
            </Text>

            <div className="border-t border-dashed border-gray-300 pt-4 mt-2">
              <Text size="sm" className="flex justify-between">
                <span>Total</span>
                <span className="font-medium">₱{order.total_price.toFixed(2)}</span>
              </Text>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {/* Optional payment logo */}
              <Image src="/path/to/gcash-logo.png" alt="GCash" width={24} height={24} />
              <Text size="sm" c="dimmed">Paid via {order.payment_method || "GCash"}</Text>
            </div>
          </div>

          {/* ================= CUSTOMER & ORDER DETAILS ================= */}
          <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
              <Text fw={700} size="xl" className="mb-1">
                {order.user?.first_name
                  ? `${order.user.first_name} ${order.user.last_name}`
                  : order.user?.name}
              </Text>
              <Text size="sm" c="dimmed">{order.user?.phone}</Text>
              <Text size="sm" mt={1}>📍 {order.user?.location || "No location provided"}</Text>
              <Text size="sm" c="dimmed" mt={2}>Preparation Time: {order.estimated_time_of_completion || 0} Mins</Text>

              {/* Orders */}
              <div className="mt-4">
                <Text fw={600} mb={2}>Orders</Text>
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center mb-2">
                    <div className="w-12 h-12 mr-2">
                      <Image
                        src={item.food.thumbnail ? `${url}/storage/${item.food.thumbnail}` : "https://via.placeholder.com/60x60?text=No+Img"}
                        radius="md"
                        fit="cover"
                        width={48}
                        height={48}
                      />
                    </div>
                    <Text size="sm" fw={500} className="flex-1">{item.food.food_name} x{item.quantity}</Text>
                    <Text size="sm">₱{item.quantity * item.price}</Text>
                  </div>
                ))}
                {order.delivery_fee && (
                  <div className="flex justify-between mt-2 font-medium">
                    <Text>Delivery Fee</Text>
                    <Text>₱{order.delivery_fee}</Text>
                  </div>
                )}
              </div>

              {/* Note */}
              {order.note && (
                <div className="mt-4 p-2 bg-white border rounded">
                  <Text size="sm" fw={500}>Note:</Text>
                  <Text size="sm">{order.note}</Text>
                </div>
              )}
            </div>

            

            {/* Back Button */}
            <div className="mt-6 flex justify-end">
              <Button color="orange" onClick={() => setOpened(false)}>BACK</Button>
            </div>
          </div>
        </div>
      </Modal>

    </>
  );
}

export default AdminOrdersCard;
