import React, { useContext, useEffect, useState, useRef } from "react";
import AuthContext from "../Contexts/AuthContext";
import {
  Loader,
  Text,
  SegmentedControl,
  TextInput,
  Group,
  Stack,
  ScrollArea,
  Pagination,
  Notification,
} from "@mantine/core";
import { IconSearch, IconBell } from "@tabler/icons-react";
import AdminOrdersCard from "./AdminOrdersCard";

function AdminOrders() {
  const { token, user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // 🔹 Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;

  // 🔹 WebSocket reference
  const wsRef = useRef(null);

  // 🔹 Banner for new orders when user is not on first page
  const [newOrderBanner, setNewOrderBanner] = useState(false);

  const url = import.meta.env.VITE_API_URL;
  const wsUrl = import.meta.env.VITE_WS_URL;

  // ------------------------------
  // Fetch paginated orders
  // ------------------------------
  const fetchOrders = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${url}/api/orders/all?page=${pageNumber}&per_page=${perPage}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();

      setOrders(data.orders || []);
      setPage(data.current_page || 1);
      setTotalPages(data.last_page || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // Update order status manually
  // ------------------------------
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

  // ------------------------------
  // WebSocket message handler
  // ------------------------------
  const handleOrderEvent = (msg) => {
    const { event, order } = msg;

    setOrders((prev) => {
      switch (event) {
        case "create":
          if (page === 1) {
            // If on first page, prepend immediately
            return [order, ...prev];
          } else {
            // If not on first page, show banner instead
            setNewOrderBanner(true);
            return prev;
          }
        case "cancelled":
          return prev.map((o) =>
            o.id === order.id ? { ...o, status: "cancelled" } : o
          );
        case "update":
          return prev.map((o) => (o.id === order.id ? { ...order } : o));
        case "delete":
          return prev.filter((o) => o.id !== order.id);
        default:
          return prev;
      }
    });
  };

  // ------------------------------
  // WebSocket connection
  // ------------------------------
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
  }, [token, user, page]);

  // ------------------------------
  // Initial fetch
  // ------------------------------
  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  // ------------------------------
  // Filtering logic
  // ------------------------------
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch =
      order.id.toString().includes(search.toLowerCase()) ||
      order.user?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      (order.user &&
        `${order.user.first_name} ${order.user.last_name}`
          .toLowerCase()
          .includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // ------------------------------
  // Color map for statuses
  // ------------------------------
  const statusColors = {
    pending: "yellow",
    approved: "blue",
    declined: "red",
    completed: "green",
    cancelled: "gray",
  };

  return (
    <Stack gap="md">
      {/* 🔹 Header Section */}
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

      {/* 🔹 Filter Tabs */}
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

      {/* 🔹 New Order Banner */}
      {newOrderBanner && (
        <Notification
          icon={<IconBell size={20} />}
          color="green"
          onClose={() => setNewOrderBanner(false)}
          withBorder
          radius="md"
        >
          <b>New order received!</b> — refresh or go to page 1 to view it.
        </Notification>
      )}

      {/* 🔹 Column Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center border-b border-slate-700 px-4 py-3">
        <Text fw={700} size="sm" className="hoc_font">
          Order Info
        </Text>
        <Text fw={700} size="sm" ta="center" className="hoc_font">
          Status
        </Text>
        <Text fw={700} size="sm" ta="center" className="hoc_font">
          Update Status
        </Text>
        <Text fw={700} size="sm" ta="center" className="hoc_font">
          ETC
        </Text>
        <Text fw={700} size="sm" ta="right" className="hoc_font">
          Total
        </Text>
      </div>

      {/* 🔹 Orders List */}
      {loading ? (
        <Loader color="orange" size="lg" variant="bars" />
      ) : filteredOrders.length > 0 ? (
        <>
          <ScrollArea h="80vh">
            <Stack gap="sm" mt="sm">
              {filteredOrders.map((order) => (
                <AdminOrdersCard
                  key={order.id}
                  order={order}
                  statusColors={statusColors}
                  updateStatus={updateStatus}
                  setOrders={setOrders}
                />
              ))}
            </Stack>
          </ScrollArea>

          {/* 🔹 Pagination Controls */}
          <Group justify="center" mt="md">
            <Pagination
              total={totalPages}
              value={page}
              onChange={(p) => setPage(p)}
              color="orange"
              radius="xl"
            />
          </Group>
        </>
      ) : (
        <Text ta="center" c="dimmed" mt="lg">
          No orders found.
        </Text>
      )}
    </Stack>
  );
}

export default AdminOrders;
