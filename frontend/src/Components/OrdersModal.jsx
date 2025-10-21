import React, { useContext, useEffect, useState } from "react";
import { Modal, Loader, Text, Card, Image, Button, Badge } from "@mantine/core";
import { OrderContext } from "../Contexts/Orderprovider";
import CartItemCard from "./CartItemCard";

export default function OrdersModal({ opened, onClose }) {
  const { 
          cancelOrder,
          orders,
          loading,
        }=useContext(OrderContext)

        const url = import.meta.env.VITE_API_URL;

  const statusColors = {
    pending: "yellow",
    approved: "blue",
    declined: "red",
    completed: "green",
    cancelled: "gray",
  };
  return (
    <Modal opened={opened} onClose={onClose} title="Order List" size="lg">
      {loading ? (
        <Loader />
      ) : orders.length > 0 ? (
        <div className="space-y-4 w-full">
          {orders.map((order) => (
            <Card key={order.id} shadow="sm" padding="lg" radius="md" withBorder>
              
              <Text size="sm" c="dimmed">
                Placed on {new Date(order.created_at).toLocaleString()}
              </Text>

              <Badge size="sm" color="green" radius="md">
                ETC {order.estimated_time_of_completion != 0 ? order.estimated_time_of_completion: ""} mins
              </Badge>

              <div className="space-y-2 mt-2 w-full flex flex-col items-center justify-center">
                {order.items.map((item) => (
                  <CartItemCard item={item} url={url} isOrder orderId={order.id}/>
                ))}
              </div>


              <div className=" flex flex-row w-full m-3">
                <div className="w-full flex flex-row gap-5 items-center justify-start">
                 
                  <Badge color={statusColors[order.status]} size="xl" radius="md">
                      {order.status.toUpperCase()}
                  </Badge>
                 

                {order.status === "pending" && (
                  <Button
                    color="red"
                    size="xs"
                    onClick={() => cancelOrder(order.id)}
                  >
                    Cancel Order
                  </Button>
                )}
                </div>
                

                <span className="w-[30%]">
                  Total: ${order.total_price}
                </span>
              </div>
              

              
            </Card>
          ))}
        </div>
      ) : (
        <Text>No orders found.</Text>
      )}
    </Modal>
  );
}
