import React, { useContext, useEffect, useState, useRef } from "react";
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
  NumberInput,
  Group,
  Stack,
  Divider,
  ScrollArea,
  Container,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import AdminOrdersCard from "./AdminOrdersCard";

function AdminOrders() {
  const { token, user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const url = import.meta.env.VITE_API_URL;
  const wsUrl = import.meta.env.VITE_WS_URL;
  

  const wsRef = useRef(null);

  
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
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update order status manually
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

      // Optimistic UI update
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

  // Handle WebSocket events
  const handleOrderEvent = (msg) => {
    const { event, order } = msg;

    setOrders((prev) => {
      switch (event) {
        case "create":
          return [order, ...prev];
        case "cancelled":
          return prev.map((o) =>
            o.id === order.id ? { ...o, status: "cancelled" } : o
          );
        case "delete":
          return prev.filter((o) => o.id !== order.id);
        default:
          return prev;
      }
    });
  };

  useEffect(()=>{
    fetchOrders();
  },[])
  
  useEffect(() => {
    

    if (!token) return;

    const ws = new WebSocket(`${wsUrl}/ws/order/${user?.id}`);
    wsRef.current = ws;

    ws.onopen = () => console.log("✅ Connected to order WebSocket");
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "order") handleOrderEvent(msg);
      } catch (err) {
        console.error("WS error", err);
      }
    };
    ws.onclose = () => console.log("❌ Order WebSocket closed");

    return () => ws.close();
  }, [token, user]);

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
    <>
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between" align="center">
          <h1 className="hoc_font text-amber-600 font-extrabold text-2xl">
            Admin Orders
          </h1>
          <TextInput
            icon={<IconSearch size={18} />}
            placeholder="Search by Order ID or Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            w="40%"
          />
        </Group>

        <SegmentedControl
          value={filter}
          onChange={setFilter}
          fullWidth
          radius="xl"
          color="orange"
          data={[
            { label: "All", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Declined", value: "declined" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
          ]}
          transitionDuration={200}
        />
        <div className="flex flex-row w-full  items-center gap-[20%] p-4 border-b border-slate-700">
          <h1 className="hoc_font">Order Info</h1>
          <h1  className="hoc_font">Status</h1>
          <h1 className="hoc_font">Update Status</h1>
          <h1 className="hoc_font">ETC</h1>
          <h1 className="hoc_font">Total</h1>
          
        </div>
        {/* Orders List */}
        {loading ? (
          <Loader color="orange" size="lg" variant="bars" />
        ) : filteredOrders.length > 0 ? (
          <ScrollArea h="90vh">
            <Stack gap="lg">
              {filteredOrders.map((order) => (
                <AdminOrdersCard order={order} statusColors={statusColors} updateStatus={updateStatus} setOrders={setOrders} />
              ))}
            </Stack>
          </ScrollArea>
        ) : (
          <Text ta="center" c="dimmed" mt="lg">
            No orders found.
          </Text>
        )}
      </Stack>
    </>
  );
}

export default AdminOrders;
