import React from "react";
import Header from "../Components/Header";
import { ArrowRight } from "lucide-react";
import AppButton from "../Components/AppButton"; 
import chickenBucket from "../assets/chicken_bucket.png";

function LandingPage() {
  return (
    <>
      <Header />
      <section className="relative w-full bg-[#FFF9F2] overflow-hidden h-[600px]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center py-16">
          {/* LEFT CONTENT */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-amber-900">
              DA <span className="text-orange-500">BES</span> TASTING <br />
              CHICKEN IN TOWN!
            </h1>
            <p className="mt-6 text-gray-700 max-w-md mx-auto md:mx-0">
              Bes House of Chicken in Apalit, Pampanga serves flavorful, juicy
              chicken at budget-friendly prices. Perfect for casual meals with
              friends or family — where chicken is always the star!
            </p>

            
            <div className="mt-8">
              <AppButton
                useCase="menu"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
              >
                VIEW MENU
              </AppButton>
            </div>
          </div>

          
          <div className="flex-1 relative mt-10 md:mt-0 flex justify-center">
            {/* Orange Rectangle */}
            <div
              className="absolute z-0"
              style={{
                width: "428px",
                height: "700px",
                top: "50%",
                left: "50%",
                transform: "translate(-30%, 0)", 
                backgroundColor: "rgba(245, 142, 49, 1)", 
                borderTopLeftRadius: "243px",
                borderTopRightRadius: "50px",
              }}
            />

            {/* Yellow Rectangle */}
            <div
              className="absolute z-0"
              style={{
                width: "80px",
                height: "700px",
                top: "50%",
                left: "calc(50% + 250px)", 
                transform: "translateY(0)",
                backgroundColor: "rgba(242, 210, 75, 1)", 
                borderTopRightRadius: "50px",
              }}
            />

            {/* Chicken Bucket */}
            <img
              src={chickenBucket}
              alt="Bes House of Chicken"
              className="relative z-10 w-[400px] h-[500px] drop-shadow-xl"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default LandingPage;
