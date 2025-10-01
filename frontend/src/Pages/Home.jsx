import React, { useState } from "react";
import Header from "../Components/Header";
import Feature from "../Components/Feature";
import AppButton from "../Components/AppButton";
import Menu from "../Components/Menu";
import CartComponent from "../Components/CartComponent";


function Home() {
  const [activeTab, setActiveTab] = useState("menu");

  return (
    <div className="flex flex-row items-center justify-center w-full h-full">
      <div className={`${activeTab == "menu" ? 'w-[75%]' : 'w-full'}`}>
        {/* Header */}
        <Header variant="home" />
        
        {/* Tabs */}
        <div className="flex justify-start w-full p-5 mt-6 ">
          <div className="flex gap-5 p-1 rounded-full">
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
        <div className="h-full mt-6">
         
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
