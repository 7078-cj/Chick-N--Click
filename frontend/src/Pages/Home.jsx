import React, { useState } from "react";
import Header from "../Components/Header";
import Feature from "../Components/Feature";
import AppButton from "../Components/AppButton";
import Menu from "../Components/Menu";
import CartComponent from "../Components/CartComponent";


function Home() {
  const [activeTab, setActiveTab] = useState("menu");

  return (
    <div className="w-full flex flex-row h-full items-center justify-center">
      <div className={`${activeTab == "menu" ? 'w-[75%]' : 'w-full'}`}>
        {/* Header */}
        <Header variant="home" />
        
        {/* Tabs */}
        <div className="w-full flex justify-start  mt-6 p-5 ">
          <div className="flex  rounded-full gap-5 p-1">
            <AppButton
              useCase={activeTab === "featured" ? "tabActive" : "tabInactive"}
              roundedType="full"
              size="md"
              bold={true}
              onClick={() => setActiveTab("featured")}
            >
              FEATURED
            </AppButton>

            <AppButton
              useCase={activeTab === "menu" ? "tabActive" : "tabInactive"}
              roundedType="full"
              size="md"
              bold={true}
              onClick={() => setActiveTab("menu")}
            >
              MENU
            </AppButton>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6 h-full">
         
            {activeTab === "featured" && <Feature />}
            {activeTab === "menu" && <Menu/>}

        </div>
      </div>
      {activeTab === "menu" && <div className="flex flex-col p-5 w-[25%] h-full items-center justify-center">
          <CartComponent/>
      </div>}
    </div>
  );
}

export default Home;
