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
  const [categoryFilter, setCategoryFilter] = useState("all"); 
  const [search, setSearch] = useState("");

  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;

  // WebSocket
  const wsRef = useRef(null);
  const [newOrderBanner, setNewOrderBanner] = useState(false);

  const url = import.meta.env.VITE_API_URL;
  const wsUrl = import.meta.env.VITE_WS_URL;

  // -------------------------------
  // Fetch orders WITH backend filters
  // -------------------------------
  const fetchOrders = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${url}/api/orders/all?page=${pageNumber}&per_page=${perPage}&status=${filter}&category=${categoryFilter}&search=${search}`,
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

  // -------------------------------
  // Status update
  // -------------------------------
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

      if (!res.ok) throw new Error("Failed status update");
      const data = await res.json();

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: data.order.status } : o
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------
  // WebSocket events
  // -------------------------------
  const handleOrderEvent = (msg) => {
    const { event, order } = msg;

    setOrders((prev) => {
      switch (event) {
        case "create":
          if (page === 1) {
            return [order, ...prev];
          } else {
            setNewOrderBanner(true);
            return prev;
          }

        case "update":
          return prev.map((o) => (o.id === order.id ? order : o));

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

  // -------------------------------
  // WebSocket connection
  // -------------------------------
  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`${wsUrl}/ws/order/${user?.id}`);
    wsRef.current = ws;

    ws.onopen = () => console.log("WS Connected");
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "order") handleOrderEvent(msg);
      } catch (err) {
        console.error(err);
      }
    };

    ws.onclose = () => console.log("WS Closed");
    return () => ws.close();
  }, [token, user, page]);

  // -------------------------------
  // Fetch on page change
  // -------------------------------
  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  // -------------------------------
  // Fetch when filters change
  // Reset to page 1
  // -------------------------------
  useEffect(() => {
    setPage(1);
    fetchOrders(1);
  }, [filter, categoryFilter, search]);

  // -------------------------------
  // Colors
  // -------------------------------
  const statusColors = {
    pending: "yellow",
    approved: "blue",
    declined: "red",
    completed: "green",
    cancelled: "gray",
  };

  return (
    <Stack gap="md">
      {/* Header */}
      <Group justify="space-between">
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

      {/* Filters */}
      <Group>
        <SegmentedControl
          value={filter}
          onChange={setFilter}
          radius="xl"
          color="orange"
          fullWidth
          data={[
            { label: "All", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Declined", value: "declined" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
          ]}
        />

      </Group>

      {/* Banner */}
      {newOrderBanner && (
        <Notification
          icon={<IconBell size={20} />}
          color="green"
          onClose={() => setNewOrderBanner(false)}
        >
          <b>New order received!</b> Go to page 1 to view it.
        </Notification>
      )}

      {/* Table Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] border-b px-4 py-3">
        <Text fw={700}>Order Info</Text>
        <Text fw={700} ta="center">
          Status
        </Text>
        <Text fw={700} ta="center">
          Update Status
        </Text>
        <Text fw={700} ta="center">
          ETC
        </Text>
        <Text fw={700} ta="right">
          Total
        </Text>
      </div>

      {/* Order List */}
      {loading ? (
        <Loader color="orange" size="lg" />
      ) : orders.length > 0 ? (
        <>
          <ScrollArea h="80vh">
            <Stack>
              {orders.map((order) => (
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

          <Group justify="center" mt="md">
            <Pagination
              total={totalPages}
              value={page}
              onChange={setPage}
              color="orange"
            />
          </Group>
        </>
      ) : (
        <Text ta="center" c="dimmed">
          No orders found.
        </Text>
      )}
    </Stack>
  );
}

export default AdminOrders;
