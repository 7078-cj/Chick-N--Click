import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Text, Title, Button, Center, Loader, Stack } from "@mantine/core";
import { IconCheck, IconX, IconAlertTriangle } from "@tabler/icons-react";

export default function CheckoutSuccess() {
  const { order_id } = useParams();
  const url = import.meta.env.VITE_API_URL;
  const [status, setStatus] = useState(null);

  useEffect(() => {
    async function verifyPayment() {
      try {
        const res = await fetch(`${url}/api/payments/verify/${order_id}`);
        const data = await res.json();

        if (data.status === "paid") {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        setStatus("error");
      }
    }
    verifyPayment();
  }, [order_id]);

  const renderContent = () => {
    switch (status) {
      case "success":
        return (
          <Stack align="center" spacing="md">
            <IconCheck size={64} color="green" />
            <Title order={2} c="green">
              Payment Successful!
            </Title>
            <Text c="dimmed" ta="center">
              Thank you for your purchase. Your order #{order_id} has been confirmed.
            </Text>
            <Button component={Link} to="/" color="green" size="md" radius="md">
              Continue Shopping
            </Button>
          </Stack>
        );

      case "failed":
        return (
          <Stack align="center" spacing="md">
            <IconX size={64} color="red" />
            <Title order={2} c="red">
              Payment Failed
            </Title>
            <Text c="dimmed" ta="center">
              We couldn’t confirm your payment for order #{order_id}.
            </Text>
            <Button component={Link} to="/checkout" color="red" size="md" radius="md">
              Try Again
            </Button>
          </Stack>
        );

      case "error":
        return (
          <Stack align="center" spacing="md">
            <IconAlertTriangle size={64} color="orange" />
            <Title order={2} c="orange">
              Verification Error
            </Title>
            <Text c="dimmed" ta="center">
              Something went wrong while verifying your payment. Please try again.
            </Text>
            <Button component={Link} to="/checkout" color="orange" size="md" radius="md">
              Retry Verification
            </Button>
          </Stack>
        );

      default:
        return (
          <Center>
            <Stack align="center">
              <Loader size="lg" />
              <Text c="dimmed">Verifying payment...</Text>
            </Stack>
          </Center>
        );
    }
  };

  return (
    <Center mih="100vh" bg="gray.0" p="md">
      <Card shadow="md" radius="lg" p="xl" withBorder w={400}>
        {renderContent()}
      </Card>
    </Center>
  );
}
