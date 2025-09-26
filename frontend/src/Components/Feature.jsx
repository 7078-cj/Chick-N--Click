import React from 'react'

import deal1 from "../assets/deal1.png";
import orangeRectangle from "../assets/orange_rectangle.svg";
import yellowRectangle from "../assets/yellow_rectangle.svg";

import { Container, Grid, Card, Text } from "@mantine/core";

import AppButton from "../Components/AppButton";

function Feature() {
  return (
    <>
    <section className="relative w-full bg-white overflow-hidden p-5">
          
          <div className="relative z-10 mt-8 md:mt-0">
            <img
              src={deal1}
              alt="Chicken Bucket"
              className="w-full h-[400px]"
            />
          </div>
        
      </section>

    <section className=" mx-auto py-16 px-4">
      {/* Title */}
      <h2 className="text-lg font-bold mb-6">FEATURED</h2>

      <div className="flex flex-row items-center justify-center gap-6">
        {/* Left Card */}
        <div className="bg-white shadow-md rounded-2xl border border-gray-200 p-6">
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800"
            alt="Restaurant"
            className="rounded-xl mb-4 w-full h-56 object-cover"
          />
          <h3 className="text-lg font-bold mb-2">
            BES House of Chicken in Apalit: Built on Love, Strengthened by
            Faith, Inspired by Hope
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            BES House of Chicken is more than just a place for crispy fried
            chicken—it’s a story of love from a grandfather, strengthened by
            faith, and inspired by hope, now serving as a beloved spot in
            Apalit.
          </p>
          <AppButton useCase="order" size="md">
            Learn More
          </AppButton>
        </div>

        {/* Right Card */}
        <div className="bg-white shadow-md rounded-2xl border border-gray-200 p-6 w-[400px]">
          <img
            src={deal1}
            alt="Meal"
            className="rounded-xl mb-4 w-full h-56 object-cover"
          />
          <h3 className="text-lg font-bold mb-2">
            Why Everyone Loves the Famous C1 Meal at BES House of Chicken?
          </h3>
          <p className="text-sm text-gray-600">
            The C1 is BES’s signature combo: crispy fried chicken paired with
            rice and savory gravy. It’s affordable, filling, and the top choice
            for first-time visitors.
          </p>
        </div>
      </div>
    </section>
      </>
  )
}

export default Feature