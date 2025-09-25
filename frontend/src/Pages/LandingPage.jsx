import React from "react";
import Header from "../Components/Header";
import { ArrowRight } from "lucide-react";
import AppButton from "../Components/AppButton";
import chickenBucket from "../assets/chicken_bucket.png";


import orange_rectangle from "../assets/orange_rectangle.svg";
import yellow_rectangle from "../assets/yellow_rectangle.svg";

function LandingPage() {
  return (
    <>
      <Header />
      
      <section className="relative w-full bg-[#FFF9F2] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center py-16">
         
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
                textSize={"lg"}
                bold={true}
              >
                VIEW MENU
              </AppButton>
            </div>
          </div>

         
          <div className="flex-1 relative mt-10 md:mt-0 flex justify-center">
            {/* Orange Rectangle */}
            <img
              src={orange_rectangle}
              alt="Orange background shape"
              className="absolute z-0 w-[428px] h-[521px] top-1/2 left-1/2 -translate-x-[30%] -translate-y-[20%]"
            />

            {/* Yellow Rectangle */}
            <img
              src={yellow_rectangle}
              alt="Yellow background shape"
              className="absolute z-0 w-[80px] h-[521px] top-1/2 left-[calc(50%+250px)] -translate-y-[20%]"
            />

            {/* Chicken Bucket */}
            <img
              src={chickenBucket}
              alt="Bes House of Chicken"
              className="relative z-10 w-[380px] drop-shadow-xl"
            />
          </div>
        </div>
      </section>


    </>
  );
}

export default LandingPage;
