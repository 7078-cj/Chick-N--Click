import React from "react";
import {
  Modal,
  ScrollArea,
  Text,
  Divider,
  Button,
  Image,
} from "@mantine/core";
import UserLocationMap from "./LeafletMap";
import { Distance } from "../utils/Distance";


function OrderDetailsModal({ opened, order, setOpened }) {
  if (!order) return null;
  console.log(order)

  const totalPrice = order.total_price ? parseFloat(order.total_price) : 0;
  const subtotal = totalPrice - 30;
  const url = import.meta.env.VITE_API_URL || ""; 

    const dis = Distance(order.latitude, order.longitude)
  
      let dis_price = 0;
      let extra_km = 0;
  
      if (order.type === "pickup") {
          dis_price = 0;
      } else {
          const base_km = 3;
          const base_price = 55;
          const extra_price = 10;
  
          if (dis <= base_km) {
              dis_price = base_price;
          } else {
              extra_km = Math.ceil(dis - base_km); 
              dis_price = base_price + (extra_km * extra_price);
          }
      }

  return (
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
        <div className="bg-white border border-gray-100 p-6 rounded-lg shadow-sm flex flex-col justify-between w-full h-fit md:w-1/3">
          <div className="w-full h-64 rounded-lg overflow-hidden shadow-md mb-6">
            <UserLocationMap
              editMode={false}
              setLocation={() => {}}
              location={{
                lat: parseFloat(order.latitude) || 14.5995,
                lng: parseFloat(order.longitude) || 120.9842,
                full: order.location || "No location provided",
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
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Paymongo Fee</span>
              <span>₱30.00</span>
            </div>
            <div className="flex flex-col justify-between mt-1">
                <span>Extra Km: {extra_km}</span>
                <div className="flex justify-between mt-1">
                  <span>Delivery Fee</span>
                  <span>₱{dis_price}</span>
                </div>
            </div>

            <Divider my="xs" variant="dashed" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₱{totalPrice.toFixed(2)}</span>
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
        <div className="w-full h-fit bg-white border border-gray-100 p-6 rounded-lg shadow-sm flex flex-col justify-between">
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
                {order.location || "No location provided"}
              </Text>
            </Text>

            <Text size="sm" c="dimmed">
              Lat:{" "}
              <Text span c="orange.8">
                {order.latitude || "N/A"}
              </Text>{" "}
              | Lng:{" "}
              <Text span c="orange.8">
                {order.longitude || "N/A"}
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
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-3 bg-gray-50 rounded-md p-2 hover:bg-gray-100 transition"
                >
                  <div className="w-12 h-12 mr-2">
                    <Image
                      src={
                        item.food?.thumbnail
                          ? `${item.food.thumbnail}`
                          : "https://via.placeholder.com/60x60?text=No+Img"
                      }
                      radius="md"
                      fit="cover"
                      width={48}
                      height={48}
                    />
                  </div>
                  <Text size="sm" fw={500} className="flex-1">
                    {item.food?.food_name} ×{item.quantity}
                  </Text>
                  <Text size="sm" fw={600}>
                    ₱{(item.quantity * item.price).toFixed(2)}
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
  );
}

export default OrderDetailsModal;
