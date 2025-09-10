import React from "react";
import FoodList from "../Components/FoodList";
import FoodForm from "../Components/FoodForm";
import CartModal from "../Components/CartModal";
import { Container, Title, Grid, Card } from "@mantine/core";

function Home() {
  return (
    <Container size="xl" className="py-10">
     
      <Title order={1} align="center" mb="xl" className="text-3xl font-bold">
        🍽️ Welcome to HOC
      </Title>

      <Grid gutter="xl">
        
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-6">
            <Title order={2} size="h3" mb="md">
              Available Foods
            </Title>
            <FoodList />
          </Card>
        </Grid.Col>

       
        <Grid.Col span={{ base: 12, md: 4 }}>
          <CartModal />
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default Home;
