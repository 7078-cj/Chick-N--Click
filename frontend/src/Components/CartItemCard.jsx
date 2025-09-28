import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../Contexts/AuthContext";

export default function CartItemCard({
  item,
  url,
  onUpdate,
  onRemove,
  selected,
  onToggleSelect,
  selectedItems
}) {
  const { token } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(item.quantity);

  useEffect(() => {
    if (quantity !== item.quantity) {
      const timeout = setTimeout(() => {
        handleUpdateQuantity(quantity);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [quantity]);

  const handleUpdateQuantity = async (newQty) => {
    try {
      const res = await fetch(`${url}/api/cart/add/${item.food_id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQty }),
      });

      await res.json();
      onUpdate(item.food_id, newQty);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative flex items-center">
     
      <div
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect(item.food_id);
        }}
        className={`absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 cursor-pointer flex items-center justify-center transition
          ${selectedItems.includes(item.food_id) ? "bg-orange-500 border-orange-500" : "border-gray-400"}`}
      >
        {selectedItems.includes(item.food_id) && <span className="w-2 h-2 bg-white rounded-full"></span>}
      </div>

      {/* Card */}
      <div
        className={`flex items-center bg-[#fef9e7] rounded-3xl overflow-hidden w-[380px] shadow-md transition
          ${selected ? "ring-2 ring-orange-500" : ""}`}
      >
        {/* Image */}
        <div className="flex-shrink-0 w-[100px] h-20 overflow-hidden rounded-3xl bg-yellow-400 flex items-center justify-center">
          <img
            src={
              item.thumbnail ||
              "https://via.placeholder.com/150x100?text=No+Image"
            }
            alt={item.food_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 px-3">
          <h3 className="font-bold text-black">{item.food_name}</h3>
          <p className="text-[#ff6600] font-semibold">₱{item.price}</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex flex-col items-center bg-yellow-300 px-2 py-1 rounded-r-lg">
          <button
            className="text-lg font-bold text-orange-700 hover:text-orange-900"
            onClick={(e) => {
              e.stopPropagation();
              setQuantity((prev) => prev + 1);
            }}
          >
            +
          </button>
          <span className="font-bold">{quantity}</span>
          <button
            className="text-lg font-bold text-orange-700 hover:text-orange-900"
            onClick={(e) => {
              e.stopPropagation();
              if (quantity > 1) setQuantity((prev) => prev - 1);
            }}
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
}
