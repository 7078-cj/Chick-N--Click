import React from 'react'

import deal1 from "../assets/deal1.png";


import AppButton from "../Components/AppButton";

function Feature() {
  return (
    <>
    <section className="relative w-full p-5 overflow-hidden bg-white">
          
          <div className="relative z-10 mt-8 md:mt-0">
            <img
              src={deal1}
              alt="Chicken Bucket"
              className="w-full h-[400px]"
            />
          </div>
        
      </section>

    <section className="px-4 py-16 mx-auto ">
      {/* Title */}
      <h2 className="mb-6 text-lg font-bold ">FEATURED</h2>

      <div className="flex flex-row items-center justify-center gap-6">
        {/* Left Card */}
        <div className="p-6 bg-white border border-gray-200 shadow-md rounded-2xl">
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800"
            alt="Restaurant"
            className="object-cover w-full h-56 mb-4 rounded-xl"
          />
          <h3 className="mb-2 text-lg font-bold">
            BES House of Chicken in Apalit: Built on Love, Strengthened by
            Faith, Inspired by Hope
          </h3>
          <p className="mb-4 text-sm text-gray-600">
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
            className="object-cover w-full h-56 mb-4 rounded-xl"
          />
          <h3 className="mb-2 text-lg font-bold">
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