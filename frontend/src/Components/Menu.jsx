import React from 'react'
import FoodList from './FoodList'

import deal1 from "../assets/deal1.png";

function Menu() {
  return (
    <>
    <section className="relative w-full bg-white overflow-hidden p-5">
              
              <div className="relative z-10 mt-8 md:mt-0">
                <img
                  src={deal1}
                  alt="Chicken Bucket"
                  className="w-full h-[250px]"
                />
              </div>
            
          </section>
        <FoodList/>
    </>
  )
}

export default Menu