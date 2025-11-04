import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Text,
  Select,
  NumberInput,
  Button,
  Badge,
  Modal,
  ScrollArea,
  Image,
  Divider,
  Group,
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
      if (etc > 0) updateETC();
    }, 1000);
    return () => clearTimeout(delay);
  }, [etc]);

  return (
    <>
      {/* ================= CARD ================= */}
      <Card
        withBorder
        radius="md"
        shadow="sm"
        className="hover:shadow-md transition-shadow duration-200 bg-white"
        style={{
          borderLeft: `6px solid var(--mantine-color-${statusColors[order.status]}-6)`,
        }}
      >
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-2 w-full">
          {/* 1️⃣ ORDER INFO */}
          <div className="flex flex-col">
            <Text fw={700}>Order #{order.id}</Text>
            <Text size="xs" c="dimmed">
              {new Date(order.created_at).toLocaleString()}
            </Text>

            <Text fw={500} mt={4}>
              Customer:{" "}
              <Text span c="blue.8" fw={600}>
                {order.user?.first_name
                  ? `${order.user.first_name} ${order.user.last_name}`
                  : order.user?.name}
              </Text>
            </Text>

            <Text fw={500}>
              Location:{" "}
              <Text span c="teal.8">
                {order.user?.location || "No location provided"}
              </Text>
            </Text>

            <Text size="xs" c="dimmed">
              Lat:{" "}
              <Text span c="orange.8">
                {order.user?.latitude || "N/A"}
              </Text>{" "}
              | Lng:{" "}
              <Text span c="orange.8">
                {order.user?.longitude || "N/A"}
              </Text>
            </Text>

            <Text fw={500}>
              Phone:{" "}
              <Text span c="orange.8">
                {order.user?.phone_number || "N/A"}
              </Text>
            </Text>

            {order.type && (
              <Badge
                color="gray"
                variant="light"
                size="lg"
                radius="sm"
                mt={4}
                fw={500}
              >
                {order.type}
              </Badge>
            )}
          </div>

          {/* 2️⃣ STATUS */}
          <div className="flex justify-center">
            <Badge
              color={statusColors[order.status]}
              variant="filled"
              size="lg"
              radius="sm"
            >
              {order.status.toUpperCase()}
            </Badge>
          </div>

          {/* 3️⃣ UPDATE STATUS */}
          <div className="flex justify-center">
            {order.status === "cancelled" ? (
              <Button size="xs" color="gray" disabled radius="sm">
                Cancelled
              </Button>
            ) : (
              <Select
                size="sm"
                data={["pending", "approved", "declined", "completed"]}
                value={order.status}
                onChange={(value) => updateStatus(order.id, value)}
                w={150}
                withinPortal
              />
            )}
          </div>

          {/* 4️⃣ ETC */}
          <div className="flex justify-center items-center">
            <NumberInput
              placeholder="ETC"
              min={0}
              w={100}
              value={etc}
              onChange={setEtc}
              size="sm"
            />
            <Text size="xs" ml={6} c="dimmed">
              min
            </Text>
          </div>

          {/* 5️⃣ TOTAL + DETAILS BUTTON */}
          <div className="flex flex-col items-end">
            <Text fw={700} c="green.7" size="lg">
              ₱{order.total_price.toFixed(2)}
            </Text>
            
          </div>
          
        </div>
        <div className="w-full flex flex-row items-end justify-end">
            <Button
                mt={6}
                variant="gradient"
                gradient={{ from: "orange", to: "red" }}
                size="md"
                onClick={() => setOpened(true)}
                className=""
              >
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
        radius="lg"
        overlayProps={{ opacity: 0.4, blur: 4 }}
      >
        <div className="flex flex-col md:flex-row gap-8 p-6 bg-gradient-to-br from-white to-gray-50 rounded-lg">
          {/* Left: Payment + Map */}
          <div className="bg-white border border-gray-100 p-6 rounded-lg shadow-sm flex flex-col justify-between w-full md:w-1/3">
            <div className="w-full h-64 rounded-lg overflow-hidden shadow-md mb-6">
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

            <Text fw={700} size="lg" mb={4}>
              Payment Successful
            </Text>
            <Text size="sm" c="dimmed">
              Verified via {order.payment_method || "GCash"}.
            </Text>

            <Divider my="md" />
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Orders Total</span>
                <span>₱{order.total_price.toFixed(2) - 30}</span>
              </div>
              <div className="flex justify-between">
                <span>Paymongo Fee</span>
                <span>₱30</span>
              </div>
              <Divider my="xs" variant="dashed" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₱{order.total_price.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Image
                src="/path/to/gcash-logo.png"
                alt="GCash"
                width={24}
                height={24}
              />
              <Text size="sm" c="dimmed">
                Paid via {order.payment_method || "GCash"}
              </Text>
            </div>
          </div>

          {/* Right: Customer & Items */}
          <div className="flex-1 bg-white border border-gray-100 p-6 rounded-lg shadow-sm flex flex-col justify-between">
            <div>
              <Text fw={700} size="xl" mb={2}>
                {order.user?.first_name
                  ? `${order.user.first_name} ${order.user.last_name}`
                  : order.user?.name}
              </Text>
              <Text size="sm" c="dimmed" mb={4}>
                {order.user?.phone}
              </Text>

              <Text fw={500}>
                Location:{" "}
                <Text span c="teal.8">
                  {order.user?.location || "No location provided"}
                </Text>
              </Text>

              <Text size="sm" c="dimmed">
                Lat:{" "}
                <Text span c="orange.8">
                  {order.user?.latitude || "N/A"}
                </Text>{" "}
                | Lng:{" "}
                <Text span c="orange.8">
                  {order.user?.longitude || "N/A"}
                </Text>
              </Text>

              <Text fw={500} mt={2}>
                Phone:{" "}
                <Text span c="orange.8">
                  {order.user?.phone_number || "N/A"}
                </Text>
              </Text>

              <Text size="sm" c="dimmed" mt={4}>
                Preparation Time:{" "}
                <Text span fw={500}>
                  {order.estimated_time_of_completion || 0} mins
                </Text>
              </Text>

              <div className="mt-4">
                <Text fw={700} mb={2}>
                  Ordered Items
                </Text>
                <Divider mb="sm" />
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center mb-3 bg-gray-50 rounded-md p-2 hover:bg-gray-100 transition"
                  >
                    <div className="w-12 h-12 mr-2">
                      <Image
                        src={
                          item.food.thumbnail
                            ? `${url}/storage/${item.food.thumbnail}`
                            : "https://via.placeholder.com/60x60?text=No+Img"
                        }
                        radius="md"
                        fit="cover"
                        width={48}
                        height={48}
                      />
                    </div>
                    <Text size="sm" fw={500} className="flex-1">
                      {item.food.food_name} ×{item.quantity}
                    </Text>
                    <Text size="sm" fw={600}>
                      ₱{item.quantity * item.price}
                    </Text>
                  </div>
                ))}

                {order.delivery_fee && (
                  <div className="flex justify-between mt-2 font-medium">
                    <Text>Delivery Fee</Text>
                    <Text>₱{order.delivery_fee}</Text>
                  </div>
                )}
              </div>

              {order.note && (
                <div className="mt-4 p-3 bg-gray-50 border rounded-md">
                  <Text size="sm" fw={600}>
                    Note:
                  </Text>
                  <Text size="sm">{order.note}</Text>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="light" color="orange" onClick={() => setOpened(false)}>
                Back
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AdminOrdersCard;
