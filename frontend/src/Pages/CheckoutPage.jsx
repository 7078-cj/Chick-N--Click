import React, { useContext } from "react";
import { CartContext } from "../Contexts/CartProvider";
import CartItemCard from "../Components/CartItemCard";
import AppButton from "../Components/AppButton";

function CheckoutPage() {
  const { cart, placeOrder, placingOrder } = useContext(CartContext);
  const url = import.meta.env.VITE_API_URL;

  return (
    <div className="flex flex-row gap-6 p-6 bg-white h-screen w-full font-sans">
    <div className="flex flex-col w-full h-full">
      {/* Cart Summary */}
      <h2 className="text-3xl font-extrabold text-orange-500 leading-tight">
          CART <br /> SUMMARY
        </h2>
      <div className="w-full  bg-white rounded-xl shadow-sm p-6 flex flex-col justify-between h-screen">
        

        {/* Order type dropdown */}
        <div className="mt-6">
          <select className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700">
            <option>Choose your order type</option>
            <option>Delivery</option>
            <option>Pickup</option>
          </select>
        </div>

        {/* GCash option */}
        <button className="mt-4 flex items-center justify-between border border-gray-300 rounded-full px-4 py-3">
          <span className="text-blue-500 font-medium">Pay with GCash</span>
          <img
            src="/gcash-logo.png"
            alt="GCash"
            className="w-6 h-6"
          />
        </button>
        <div className="m-2 flex flex-col justify-between h-full items-center">
            {/* Totals */}
            <div className="mt-6 text-sm w-full">
            <div className="flex justify-between">
                <span>Sub Total</span>
                <span>₱190</span>
            </div>
            <div className="flex justify-between mt-1">
                <span>Delivery</span>
                <span>₱30</span>
            </div>
            </div>

            <div className="w-full flex flex-col gap-2">
            {/* Total */}
                <div className="mt-4 bg-yellow-100 rounded-lg p-4 flex justify-between items-center font-bold text-lg w-full">
                    <span>TOTAL</span>
                    <span>₱220</span>
                </div>

                {/* Checkout button */}
                    <AppButton
                                    useCase="menu"
                                    size="lg"
                                    onClick={placeOrder}
                                    disabled={placingOrder}
                                    className="w-full"
                                    >
                                    {placingOrder ? "Placing Order..." : "Place Order"}
                                    </AppButton>
                </div>
            </div>
        </div>
      </div>

      {/* Order List */}
      <div className="w-full bg-gray-50 rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Order List</h2>
           
        </div>

        {/* Order Item */}
        <div className="mt-6 flex items-center rounded-xl overflow-hidden">
          <div className="flex-1 space-y-4">
                      {cart.length > 0 ? (
                        cart.map((item) => (
                          <div
                            key={item.food_id}
                            
                          >
                            <CartItemCard
                              item={item}
                              url={url}
                              isOrder
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No items in cart</p>
                      )}
                    </div>
        </div>
      </div>

      {/* Pinned Location */}
      <div className="w-[60%] bg-white rounded-xl shadow-sm p-6 flex flex-col">
        {/* Map placeholder */}
        <div className="relative flex-1 bg-gray-100 rounded-lg">
          <img
            src="/map-placeholder.png"
            alt="Pinned Location"
            className="w-full h-full object-cover rounded-lg"
          />
          
        </div>

        {/* Location details */}
        <div className="mt-4 text-sm">
          <p className="font-bold text-gray-900">Your Pinned Location</p>
          <div className="flex items-center mt-2">
            <span className="text-orange-500 mr-2">📍</span>
            <span className="font-medium">Sampaloc, Apalit</span>
            <button className="ml-auto text-orange-500 text-xs">change</button>
          </div>
          <p className="text-gray-500 mt-1">
            Lorem ipsum sit amet, consectetur elit. Sed do eiusmod tempor.
          </p>
          <p className="mt-4 font-bold">Ceejay Santos</p>
          <p className="text-gray-700">+6391021232412</p>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
