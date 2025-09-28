import React, { useState } from "react";
import { Group, Button, Drawer, Stack } from "@mantine/core";
import { Search, MoreHorizontal, ShoppingCart, PhoneCall} from "lucide-react";
import hocLogo from "../assets/hoc_logo.png";
import { useNavigate } from "react-router-dom";
import CartDrawer from "./CartComponent";
import AppButton from "./AppButton";
import Order from "./Order";

export default function Header({ variant = "default" }) {
  const [opened, setOpened] = useState(false);
  const nav = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="w-full mx-auto flex items-center justify-between py-3 px-6">
        
        

        {variant === "home" ? (
          <>
           {/* Logo */}
              <img
                src={hocLogo}
                alt="Click N' Chick"
                className="h-14 w-auto object-contain cursor-pointer"
                onClick={() => nav("/")}
              />
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

              <Order/>
            </div>
          </>
        ) : (
          
          // Default (non-home) header layout
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
              <img
                src={hocLogo}
                alt="Click N' Chick"
                className="h-14 w-auto object-contain cursor-pointer"
                onClick={() => nav("/")}
              />
              
              <Group gap="lg" visibleFrom="md" className="text-gray-800 font-medium">
              
                <a href="#about" className="hover:text-yellow-500 transition">About Us</a> 
                <a href="#deals" className="hover:text-yellow-500 transition">Deals</a> 
                <a href="#find-us" className="hover:text-yellow-500 transition">Find Us</a> 
                
              </Group>

          
          <Group gap="md" visibleFrom="sm" className="hidden md:flex">
            <Button
                component="a"
                href="tel:+639108765432"
                variant="outline"
                color="brown"  
                radius="xl"
                leftSection={<PhoneCall size={16} color="black"/>}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
              Call: +63 910 8765 432
            </Button>


            <AppButton useCase="signup" bgColor={"bg-amber-400"} hoverColor={"hover:bg-amber-800"} onClick={()=>nav('/register')}>Sign Up</AppButton>

            <AppButton useCase="signin" onClick={()=>nav('/login')}>Log In</AppButton>
          </Group>

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
                Orders
              </a>
              <a href="#deals" className="hover:text-yellow-500 transition">
                Settings
              </a>
              
            </>
          )}
        </Stack>
      </Drawer>
     
    </header>
  );
}
