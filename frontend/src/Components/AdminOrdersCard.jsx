import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Text,
  Select,
  NumberInput,
  Button,
  Badge,
} from "@mantine/core";
import AuthContext from "../Contexts/AuthContext";
import OrderDetailsModal from "./OrderDetailsModal";
import DeleteModal from "./DeleteModal";


function AdminOrdersCard({ order, statusColors, updateStatus, setOrders }) {
  const url = import.meta.env.VITE_API_URL;
  const { token } = useContext(AuthContext);

  const [etc, setEtc] = useState(order.estimated_time_of_completion || 0);
  const [opened, setOpened] = useState(false);

  
  const [deleteOpened, setDeleteOpened] = useState(false);

  // DELETE ORDER
  const deleteOrder = async () => {
    try {
      const res = await fetch(`${url}/api/order/${order.id}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete order");

      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      setDeleteOpened(false);
    } catch (error) {
      console.error(error);
      alert("Error deleting order");
    }
  };

  
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

  useEffect(() => {
    const delay = setTimeout(() => {
      if (etc > 0) updateETC();
    }, 1000);
    return () => clearTimeout(delay);
  }, [etc]);

  return (
    <>
      {/* CARD */}
      <Card
        withBorder
        radius="md"
        shadow="sm"
      >
       

        <div className="w-full flex flex-row items-end justify-end gap-3">
          {/* DELETE BUTTON */}
          <Button
            color="red"
            size="md"
            variant="light"
            onClick={() => setDeleteOpened(true)}
          >
            Delete
          </Button>

          {/* VIEW DETAILS */}
          <Button
            mt={6}
            color={statusColors[order.status]}
            size="md"
            onClick={() => setOpened(true)}
          >
            View Details
          </Button>
        </div>
      </Card>

      {/* DETAILS MODAL */}
      <OrderDetailsModal opened={opened} order={order} setOpened={setOpened} />

      {/* DELETE CONFIRM MODAL */}
      <DeleteModal
        opened={deleteOpened}
        onClose={() => setDeleteOpened(false)}
        onConfirm={deleteOrder}
        itemName={`Order #${order.id}`}
      />
    </>
  );
}

export default AdminOrdersCard;
