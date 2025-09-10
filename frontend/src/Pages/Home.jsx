import React from 'react'
import FoodList from '../Components/FoodList'
import FoodForm from '../Components/FoodForm'
import Cart from '../Components/Cart'

function Home() {
  return (
    <div>
        <FoodList/>
        <FoodForm/>
        <Cart/>
    </div>
  )
}

export default Home