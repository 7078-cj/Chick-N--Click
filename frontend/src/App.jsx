import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FoodForm from './Components/FoodForm'
import FoodList from './Components/FoodList'

function App() {
  
  
  return (
    <>
      <FoodForm/>
      <div >
          <FoodList/>
      </div>
      
    </>
  )
}

export default App
