import React, { useContext, useState } from "react";
import { Modal, NumberInput } from "@mantine/core";
import { ShoppingCart } from "lucide-react";
import FoodForm from "./FoodForm";
import AuthContext from "../Contexts/AuthContext";
import AppButton from "./AppButton";

export default function FoodCard({ food, url, onDelete, onUpdate, handleAddToCart }) {
  const { token, user } = useContext(AuthContext);
  const [opened, setOpened] = useState(false);
  const [cartOpened, setCartOpened] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!food) return null;

  

  return (
    <>
      <div
        className={`w-[320px] rounded-2xl shadow-md border overflow-hidden transition 
          ${
            food.available
              ? "bg-white border-gray-200"
              : "bg-gray-200 border-gray-300 opacity-70"
          }
        `}
      >
        {/* Top Section with Thumbnail */}
        <div className="relative h-[200px] w-full">
          {/* Availability Badge */}
          <span
            className={`absolute top-3 left-0 text-white text-xs font-bold px-3 py-1 rounded-r-md shadow
              ${food.available ? "bg-orange-400" : "bg-gray-500"}
            `}
          >
            {food.available ? "AVAILABLE" : "UNAVAILABLE"}
          </span>

          {/* Cart Button (only for non-admins) */}
          {!user?.role || user.role !== "admin" ? (
            <AppButton
              useCase="menu"
              size="sm"
              roundedType="full"
              icon={ShoppingCart}
              className="absolute top-3 right-3 w-10 h-10"
              onClick={() => setCartOpened(true)}
              disabled={!food.available}
            />
          ) : null}

          {/* Full Thumbnail */}
          <img
            src={
              food.thumbnail
                ? `${url}/storage/${food.thumbnail}`
                : "https://via.placeholder.com/320x200?text=No+Image"
            }
            alt={food.food_name}
            className="w-full h-full object-cover"
          />

         
        </div>

        {/* Bottom Section */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-row items-start justify-between w-full">
              <div>
                  <h3 className="text-lg font-bold">{food.food_name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {food.description}
                  </p>
                  {/* Categories */}
                  
                  {food.categories && food.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {food.categories.map((cat) => (
                        <span
                          key={cat.id}
                          className="text-xs bg-amber-100 text-gray-700 px-2 py-1 rounded-md"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  )}
              </div>

              <span className="text-amber-500 font-bold">
                P{food.price}
              </span>
              
            </div>
          </div>

          {/* Admin Controls */}
          {user?.role === "admin" && (
            <div className="flex justify-between mt-4">
              <AppButton
                useCase="confirm"
                size="sm"
                onClick={() => setOpened(true)}
              >
                Edit
              </AppButton>
              <AppButton useCase="remove" size="sm" onClick={()=>onDelete(food)}>
                Delete
              </AppButton>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal opened={opened} onClose={() => setOpened(false)} title="Edit Food" size="lg">
        <FoodForm food={food} onSuccess={onUpdate} onClose={() => setOpened(false)} />
      </Modal>

      {/* Quantity Modal */}
      <Modal
        opened={cartOpened}
        onClose={() => setCartOpened(false)}
        title={`Add ${food.food_name} to Cart`}
        centered
      >
        <NumberInput
          label="Quantity"
          value={quantity}
          min={1}
          onChange={setQuantity}
          required
        />
        <AppButton
          useCase="checkout"
          fullWidth
          className="mt-4"
          onClick={()=>handleAddToCart(food,quantity)}
        >
          Confirm Add
        </AppButton>
      </Modal>
    </>
  );
}
