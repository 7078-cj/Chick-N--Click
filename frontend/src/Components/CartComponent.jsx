import React, { useContext, useState } from "react";
import { Loader } from "@mantine/core";
import { CartContext } from "../Contexts/CartProvider";
import CartItemCard from "./CartItemCard";
import AppButton from "./AppButton"; 
import AuthContext from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CartComponent() {
  const {
    cart,
    total,
    loading,
    placingOrder,
    handleUpdate,
    handleRemove,
    placeOrder,
    fetchCart
  } = useContext(CartContext);

  const [selectedItems, setSelectedItems] = useState([]); 
  const url = import.meta.env.VITE_API_URL;
  const { token } = useContext(AuthContext);
  const nav = useNavigate()

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
    fetchCart();
  };

  return (
    <div className="flex flex-col w-full min-h-screen p-6">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-medium leading-tight text-orange-600 hoc_font">
              CART <br />
              SUMMARY
            </h1>
            
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
              <div className="flex justify-between mb-4 font-bold">
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
                  onClick={()=>nav('/checkout')}
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
