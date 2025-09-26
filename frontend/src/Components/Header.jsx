import React, { useState } from "react";
import { Container, Group, Anchor, Button, Burger, Drawer, Stack } from "@mantine/core";
import { ArrowRight, Edit3, MoreHorizontal, PhoneCall, ShoppingCart } from "lucide-react";
import hocLogo from "../assets/hoc_logo.png";
import AppButton from "./AppButton.jsx";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [opened, setOpened] = useState(false);
  const nav = useNavigate()

  return (
    <header className="bg-white shadow-sm">
      <div className="w-full mx-auto flex items-center justify-around py-4 gap-5 px-5">
        <div className="flex items-center justify-between w-full">
         
          <img
            src={hocLogo}
            alt="Click N' Chick"
            className="h-16 w-auto object-contain"
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


            <AppButton useCase="signup" bgColor={"bg-amber-400"} hoverColor={"hover:bg-amber-800"} onClick={()=> nav('/register')}>
              Sign Up
              </AppButton>

            <AppButton useCase="signin" onClick={()=> nav('/login')}>
              Log In
              </AppButton>
          </Group>

          
          <div className="md:hidden">
            <Burger opened={opened} onClick={() => setOpened(!opened)} />
          </div>
        </div>
      </div>

      
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        padding="md"
        size="md"
        title="Menu"
      >
        <Stack gap="md">
          

          <Button
            component="a"
            href="tel:+639108765432"
            variant="outline"
            radius="xl"
            leftSection={<PhoneCall size={16} />}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Call: +63 910 8765 432
          </Button>

          <AppButton useCase="signup" bgColor={"bg-amber-400"} hoverColor={"hover:bg-amber-800"} onClick={()=> nav('/register')}>
              Sign Up
              </AppButton>

            <AppButton useCase="signin" onClick={()=> nav('/login')}>
              Log In
              </AppButton>
        </Stack>
      </Drawer>
    </header>
  );
}
