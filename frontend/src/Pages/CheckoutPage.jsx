import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../Contexts/CartProvider";
import CartItemCard from "../Components/CartItemCard";
import AppButton from "../Components/AppButton";
import AuthContext from "../Contexts/AuthContext";
import UserLocationMap from "../Components/LeafletMap";

function CheckoutPage() {
  const { cart, placeOrder, placingOrder,total } = useContext(CartContext);
  const url = import.meta.env.VITE_API_URL;
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState({
        lat: null,
        lng: null,
        city: "",
        country: "",
        full: "",
      });
  const [orderType, setOrderType] = useState("");

  const handleChange = (e) => {
    setOrderType(e.target.value);
    
  };


  const fetchUser = async () => {
      try {
        const res = await fetch(`${url}/api/user`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
  
        const data = await res.json();
     
        setUser(data);
        
  
        if (data.location) {
          setLocation({
            lat: data.latitude,
            lng: data.longitude,
            full: data.location,
            
          });
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
  
    useEffect(() => {
      fetchUser();
    }, []);


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
          <select
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700"
            value={orderType} 
            onChange={handleChange} 
          >
            <option value="">Choose your order type</option>
            <option value="delivery">Delivery</option>
            <option value="pickup">Pickup</option>
          </select>

         
          {orderType && (
            <p className="mt-2 text-gray-600">
              You selected: <strong>{orderType}</strong>
            </p>
          )}
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
                <span>₱{total}</span>
            </div>
            <div className="flex justify-between mt-1">
                <span>Paymongo Fee</span>
                <span>₱30</span>
            </div>
            </div>

            <div className="w-full flex flex-col gap-2">
            {/* Total */}
                <div className="mt-4 bg-yellow-100 rounded-lg p-4 flex justify-between items-center font-bold text-lg w-full">
                    <span>TOTAL</span>
                    <span>₱{total + 30}</span>
                </div>

                {/* Checkout button */}
                 <AppButton
                    useCase="menu"
                    size="lg"
                    onClick={() => placeOrder(orderType)}
                    disabled={placingOrder || !orderType}
                    className={`w-full ${!orderType ? "opacity-50 cursor-not-allowed" : ""}`} 
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
          <UserLocationMap
                            editMode={false}
                            setLocation={setLocation}
                            location={location}
                            user={user}
                          />
          
        </div>

        {/* Location details */}
        <div className="mt-4 text-sm">
          <p className="font-bold text-gray-900">Your Pinned Location</p>
          <div className="flex items-center mt-2">
            <span className="text-orange-500 mr-2">📍</span>
            <span className="font-medium">{location.full}</span>
            
          </div>
          
          <p className="mt-4 font-bold">{user?.first_name} {user?.last_name}</p>
          <p className="text-gray-700">{user?.phone_number}</p>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
