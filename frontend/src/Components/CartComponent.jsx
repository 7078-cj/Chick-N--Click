import React, { useContext, useState } from "react";
import { Loader } from "@mantine/core";
import { CartContext } from "../Contexts/CartProvider";
import CartItemCard from "./CartItemCard";
import AppButton from "./AppButton"; 
import AuthContext from "../Contexts/AuthContext";

export default function CartComponent() {
  const {
    cart,
    total,
    loading,
    placingOrder,
    handleUpdate,
    handleRemove,
    placeOrder,
  } = useContext(CartContext);

  const [selectedItems, setSelectedItems] = useState([]); 
  const url = import.meta.env.VITE_API_URL;
  const { token } = useContext(AuthContext);

  const toggleSelect = (foodId) => {
    setSelectedItems((prev) =>
      prev.includes(foodId)
        ? prev.filter((id) => id !== foodId)
        : [...prev, foodId]
    );
  };

  const handleRemoveToCart = async (foodID) => {
     

    try {
      const res = await fetch(`${url}/api/cart/remove/${foodID}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await res.json();
      handleRemove(foodID)
    } catch (err) {
      console.error(err);
      alert("Error removing item.");
    }
  };


  const removeSelected = async () => {
    for (const foodId of selectedItems) {
      await handleRemoveToCart(foodId);
      
    }
    setSelectedItems([]); 
  };

  return (
    <div className="p-6 flex flex-col h-full shadow-[6px_0_8px_-2px_rgba(0,0,0,0.2)]">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-extrabold text-orange-600 leading-tight">
              CART <br />
              SUMMARY
            </h1>
            <button className="p-2 rounded-lg bg-orange-200 hover:bg-orange-300">
              ✎
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.food_id}
                  className={`relative ${
                    selectedItems.includes(item.food_id)
                      ? "ring-2 ring-orange-500 rounded-xl"
                      : ""
                  }`}
                  onClick={() => toggleSelect(item.food_id)} 
                >
                  <CartItemCard
                    item={item}
                    url={url}
                    onUpdate={handleUpdate}
                    onRemove={handleRemove}
                    onToggleSelect={toggleSelect}
                    selectedItems={selectedItems}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No items in cart</p>
            )}
          </div>

          {/* Subtotal + Action Button */}
          {cart.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between font-bold mb-4">
                <span>SUB TOTAL</span>
                <span>₱{total}</span>
              </div>

              {selectedItems.length > 0 ? (
                <AppButton
                  useCase="remove"
                  size="lg"
                  onClick={() =>removeSelected()}
                  className="w-full"
                >
                  Remove Selected ({selectedItems.length})
                </AppButton>
              ) : (
                <AppButton
                  useCase="menu"
                  size="lg"
                  onClick={placeOrder}
                  disabled={placingOrder}
                  className="w-full"
                >
                  {placingOrder ? "Placing Order..." : "Place Order"}
                </AppButton>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
