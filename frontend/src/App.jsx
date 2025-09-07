import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FoodForm from './assets/Components/FoodForm'
import FoodList from './assets/Components/FoodList'

function App() {
  const [count, setCount] = useState(0)

  const test = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/test", {
        method: "GET", // default, but good to be explicit
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // parse response
      console.log("API Response:", data);
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  useEffect(()=>{
    test()
  },[])
  
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
