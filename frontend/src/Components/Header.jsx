import React, { useState } from "react";
import { Drawer, Stack } from "@mantine/core";
import { Search, MoreHorizontal, ShoppingCart } from "lucide-react";
import hocLogo from "../assets/hoc_logo.png";
import { useNavigate } from "react-router-dom";
import CartDrawer from "./CartDrawer";
import AppButton from "./AppButton";

export default function Header({ variant = "default" }) {
  const [opened, setOpened] = useState(false);
  const nav = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="w-full mx-auto flex items-center justify-between py-3 px-6">
        
        {/* Logo */}
        <img
          src={hocLogo}
          alt="Click N' Chick"
          className="h-14 w-auto object-contain cursor-pointer"
          onClick={() => nav("/")}
        />

        {variant === "home" ? (
          <>
            {/* Search bar (centered) */}
            

            {/* Right Icons */}
            <div className=" items-center gap-3 flex justify-center px-6">
              
              <div className="flex items-center w-full max-w-md bg-orange-50 border border-orange-200 rounded-full px-4 py-2">
                <Search size={16} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search food here..."
                  className="w-full bg-transparent focus:outline-none text-sm text-gray-600 placeholder-gray-400"
                />
              </div>
            
              {/* More button */}
           
              <AppButton
                useCase="menu"
                size="sm"
                roundedType="full"
                onClick={() => setOpened(true)}
                icon={MoreHorizontal}
              />

              <AppButton
                useCase="checkout"
                size="sm"
                roundedType="full"
                onClick={() => setCartOpen(true)}
                icon={ShoppingCart}
              />
            </div>
          </>
        ) : (
          // Default (non-home) header layout
          <div className="flex items-center gap-4">
            <button
              className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white text-sm font-medium transition"
              onClick={() => setOpened(true)}
            >
              Menu
            </button>
          </div>
        )}
      </div>

      {/* Drawer for menu */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        padding="md"
        size="md"
        title="Menu"
      >
        <Stack gap="md">
          {variant === "home" && (
            <>
              <a href="#about" className="hover:text-yellow-500 transition">
                About Us
              </a>
              <a href="#deals" className="hover:text-yellow-500 transition">
                Deals
              </a>
              <a href="#find-us" className="hover:text-yellow-500 transition">
                Find Us
              </a>
            </>
          )}
        </Stack>
      </Drawer>
      <CartDrawer opened={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
