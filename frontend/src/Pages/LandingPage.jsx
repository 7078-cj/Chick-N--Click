import React from "react";
import Header from "../Components/Header";
import { ArrowRight } from "lucide-react";
import AppButton from "../Components/AppButton";
import heroProduct from "../assets/hero_product.png";

import roastedChicken from "../assets/roasted_chicken.png";


import deal1 from "../assets/deal1.png"; // Sulit Deal
import deal2 from "../assets/deal2.png"; // 7th Anniv Sale
import deal3 from "../assets/deal3.png"; // Dine & Bite

import appSite from "../assets/app_site.png";
import locationSection from "../assets/location_section.svg";
import hocLogo from "../assets/hoc_logo.png";
import fries from "../assets/fries.png";
import { useNavigate } from "react-router-dom";


function LandingPage() {

  

  return (
    <>
      <Header />

      
      <section className=" w-full bg-[#FFF9F2] overflow-hidden">
        <div className=" mx-auto px-2 md:px-12 lg:px-20 flex flex-col justify-end w-full gap-5 md:flex-row items-center py-16">
          {/* LEFT */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-[100px] font-extrabold leading-tight text-amber-700">
              DA <span className="text-amber-400">BES</span> TASTING <br />
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

          {/* RIGHT */}
          <div className=" abosolute mt-10  flex justify-center">
           
            <img
              src={heroProduct}
              alt="Bes House of Chicken"
              className=" z-10 w-[600px] h-[700px] object-center drop-shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* ABOUT US */}
      <section
        id="about"
        className="relative w-full bg-white py-16 px-6 md:px-12 lg:px-20 my-[50px]"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-stretch gap-8">
          {/* LEFT IMAGE */}
          <div className="flex-1 flex justify-center relative">
            <img
              src={roastedChicken}
              alt="Roasted Chicken"
              className="rounded-3xl shadow-md w-[700px] h-[400px] object-cover"
            />
          </div>

          {/* RIGHT CARD */}
          <div className="flex-1 relative -ml-[10%] -mt-[-5%]">
            <div className="bg-[#FFF9F2] rounded-r-3xl rounded-tl-3xl shadow-md p-8 md:p-10 w-[320px] h-[450px]">
              <h2 className="text-2xl font-extrabold text-orange-600 uppercase mb-4">
                About Us
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                BES House of Chicken is a 24-hour Filipino fast food chain
                renowned for its signature fried chicken cooked with healthy
                herbs and spices. Established in 2018, it was born from a
                grandfather’s unconditional love for his grandchildren, whose
                all-time favorite is fried chicken—a love that continues to
                inspire the heart and soul of the brand.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-row items-center justify-center w-full">
        
          <img
                src={appSite}
                alt="Visit the app"
                className="rounded-2xl object-cover p-5 w-[60%] h-[650px]"
              />
        
      </section>

      {/* DEALS SECTION */}
      <section id="deals" className="relative w-full bg-white py-16 px-6 md:px-12 lg:px-20 my-[100px]">
        <div className="max-w-7xl mx-auto">
          {/* Title Row */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-10">
            <h2 className="text-3xl font-extrabold text-orange-900 uppercase leading-snug max-w-lg">
              Bite Into Our Best <br /> Deals!
            </h2>
            <p className="text-gray-700 max-w-xl mt-4 md:mt-0">
              Enjoy our newest chicken combos and sulit meals made for every
              craving — delicious, affordable, and perfect for sharing!
            </p>
          </div>

          
          <div className="flex flex-row gap-5">
           
            <div className="col-span-1 md:col-span-2">
              <img
                src={deal1}
                alt="Sulit Deal"
                className="rounded-2xl shadow-md w-full object-cover"
              />
            </div>

            
            <div className="flex flex-col gap-6">
              <img
                src={deal2}
                alt="7th Anniv Sale"
                className="rounded-2xl shadow-md w-full object-cover"
              />
              <img
                src={deal3}
                alt="Dine & Bite"
                className="rounded-2xl shadow-md w-full object-cover"
              />
            </div>

          </div>
          
        </div>
      </section>

       <section id="find-us" className="flex flex-row items-center justify-center w-full mt-[250px]">
        
          <img
                src={locationSection}
                className=" object-fit h-[850px]"
              />
        
      </section>

       {/* TESTIMONIAL SECTION */}
      <section
        id="testimonial"
        className="relative w-full bg-white py-20 px-6 md:px-12 lg:px-20 mb-[250px]"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <h2 className="text-4xl font-extrabold text-orange-500 uppercase tracking-wider">
            Testimonial
          </h2>
          <p className="mt-2 text-orange-600 italic font-medium">
            - Ms. Sadsad and Family -
          </p>

          {/* Quote */}
          <p className="mt-8 text-lg text-gray-800 leading-relaxed">
            “The BES tasting chicken at an affordable price! Its staffs are
            polite and accommodating. Not to mention also their gravy that's
            surely a blockbuster hit! It already became a tradition for us to
            celebrate our birthdays at BES House of Chicken. A really must try
            for everyone.”
          </p>

          {/* Orange speech bubble line */}
           <div className="mt-10 flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 400 60"
                className="w-64 h-10"
                aria-hidden="true"
                role="img"
              >
                {/* Path: horizontal line with a downward spike (tail) */}
                <path
                  d="M10 30 H160 L200 52 L220 30 H390"
                  stroke="#F97316"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <section id="contact" className="w-full mt-20">
        {/* Top banner with fries and contact email */}
        <div className="relative bg-orange-400 flex flex-row md:flex-row items-center justify-between px-6  py-5 my-[50px]">
          {/* Fries image (left) */}
          <img
            src={fries}
            alt="French Fries"
            className="w-[400px] h-[400px] absolute"
          />

          {/* Text (right) */}
          <div className="text-right w-full m-10">
            <h3 className="text-white font-semibold text-xl md:text-2xl leading-snug">
              We’d love to hear from you! Send your inquiries, feedback,
              <br className="hidden md:block" /> or suggestions to{" "}
              <span className="text-lime-200 font-bold">
                beshochelpdesk@gmail.com
              </span>
            </h3>
          </div>
        </div>

        {/* Bottom info section */}
        <div className="bg-[#FFF9F2] px-6 md:px-16 py-14">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Left: Logo and description */}
            <div className="flex flex-col items-start">
              <img
                src={hocLogo} // replace with your chicken logo asset
                alt="Click n' Chick"
                className="object-fit w-[500px] h-[200px]"
              />
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                Craving the comforts of home? Worry no more — we’re passionate
                about bringing that warm, home-cooked goodness straight to your
                table. Experience the taste of home, only here at BES House of
                Chicken.
              </p>

              {/* Social Icons */}
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  <i className="fab fa-facebook text-2xl text-gray-700 hover:text-orange-500"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  <i className="fab fa-instagram text-2xl text-gray-700 hover:text-orange-500"></i>
                </a>
              </div>
            </div>

            {/* Middle: Branch info */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Apalit Branch</h4>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>Sampaloc, Apalit, Pampanga</li>
                <li>+63 966 381 6965</li>
                <li>+63 931 010 1409</li>
                <li>beshoc.apalit@gmail.com</li>
                <li>Sunday to Friday, 6:00 am to 5:00 pm</li>
                <li>Saturday 6:00 am to 3:00 pm</li>
              </ul>
            </div>

            {/* Right: Teams */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Teams</h4>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>Bacani, Aaron Job</li>
                <li>Constano, Numeriano Lubrino</li>
                <li>Dungca, Allain Francois D.</li>
                <li>Santos, Ceejay S.</li>
                <li>Tulalian, Aaron Matthew</li>
              </ul>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}

export default LandingPage;
