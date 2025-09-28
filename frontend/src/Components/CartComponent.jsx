import React, { useContext, useEffect, useState } from "react";
import { Text, Loader, Button, Drawer, ScrollArea } from "@mantine/core";
import AuthContext from "../Contexts/AuthContext";
import CartItemCard from "./CartItemCard";
import PayWithGcash from "./PayWithGcash";
import { CartContext } from "../Contexts/CartProvider";

export default function CartComponent() {
  const { cart, total, loading, placingOrder, handleUpdate, handleRemove, placeOrder} = useContext(CartContext)

  const url = import.meta.env.VITE_API_URL;
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <ScrollArea h="80vh">
          <div className="space-y-4">
            <h1 className="font-bold text-lg">Total: ₱{total}</h1>

            {cart.length > 0 ? (
              <>
                {cart.map((item) => (
                  <CartItemCard
                    key={item.food_id}
                    item={item}
                    url={url}
                    onUpdate={handleUpdate}
                    onRemove={handleRemove}
                  />
                ))}

                <Button
                  fullWidth
                  color="green"
                  mt="md"
                  onClick={placeOrder}
                  loading={placingOrder}
                >
                  Place Order
                </Button>
              </>
            ) : (
              <Text>No items in cart</Text>
            )}
          </div>
        </ScrollArea>
      )}
    </>
  );
}
