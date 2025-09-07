import { Card, Image, Text, Button } from "@mantine/core";

export default function FoodCard({ food, url }) {
  if (!food) return null;

  return (
    <div className="w-[300px] p-4 h-full">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {/* Thumbnail */}
        <Card.Section>
          <Image
            src={
              food.thumbnail
                ? `${url}/storage/${food.thumbnail}`
                : "https://via.placeholder.com/300x200?text=No+Image"
            }
            height={200}
            className="object-cover w-full"
          />
        </Card.Section>

        {/* Name */}
        <Text fw={700} size="lg" align="left" mt="md">
          {food.food_name || "Unnamed Food"}
        </Text>

        {/* Price & Availability */}
        <div className="flex justify-between items-center mt-2">
          <Text size="sm" c="dimmed">
            Price: ${food.price ?? 0}
          </Text>
          <Text
            size="sm"
            className={food.available ? "text-green-600" : "text-red-600"}
          >
            {food.available ? "Available" : "Not Available"}
          </Text>
        </div>

        {/* Description */}
        <Text size="sm" c="dimmed" mt="sm" lineClamp={3}>
          {food.description || "No description"}
        </Text>

        {/* Action Button */}
        <div className="flex justify-between items-center mt-3">
          <Button
            size="xs"
            color="pink"
            variant="light"
            radius="xl"
            className="px-3 py-1"
          >
            Order
          </Button>
        </div>
      </Card>
    </div>
  );
}
