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
import gcash from "../assets/gcash_icon.svg";


function OrderDetailsModal({ opened, order, setOpened }) {
  if (!order) return null;

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
      <div className="flex flex-col gap-8 p-6 rounded-lg md:flex-row bg-gradient-to-br from-white to-gray-50">
        {/* Left: Payment + Map */}
        <div className="flex flex-col justify-between w-full p-6 bg-white border border-gray-100 rounded-lg shadow-sm h-fit md:w-1/3">
          <div className="w-full h-64 mb-6 overflow-hidden rounded-lg shadow-md">
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
          <div className="space-y-1 text-sm">
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

          <div className="flex flex-row items-center justify-between gap-2 mt-4">
            <div className="w-10 h-10">
              <Image
              src={gcash}
              alt="GCash"
              
            />
            </div>
            
            <Text size="sm" c="dimmed">
              Paid via {order.payment_method || "GCash"}
            </Text>
          </div>
        </div>

        {/* Right: Customer & Items */}
        <div className="flex flex-col justify-between w-full p-6 bg-white border border-gray-100 rounded-lg shadow-sm h-fit">
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
                  className="flex items-center justify-between p-2 mb-3 transition rounded-md bg-gray-50 hover:bg-gray-100"
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
              <div className="p-3 mt-4 border rounded-md bg-gray-50">
                <Text size="sm" fw={600}>
                  Note:
                </Text>
                <Text size="sm">{order.note}</Text>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
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
