import { useContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FoodForm from './Components/FoodForm'
import FoodList from './Components/FoodList'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './Contexts/AuthContext'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Home from './Pages/Home'
import PrivateRoutes from './Contexts/PrivateRoutes'
import { FoodProvider } from './Contexts/FoodProvider'
import Admin from './Pages/Admin'
import Unauthorized from './Pages/Unauthorized'
import Loading from './Pages/Loading'
import Cart from './Pages/Cart'
import CheckoutSuccess from './Pages/CheckoutSuccess'

function App() {
  

  
  
  return (
    <>
      
     
      
          <FoodProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
                
              <Route element={<PrivateRoutes allowedRoles={["user","admin"]} />} >
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout/success/:order_id" element={<CheckoutSuccess />} />
              </Route>

              <Route element={<PrivateRoutes allowedRoles={["admin"]} />} >
                <Route path="/admin" element={<Admin />} />
              </Route>

              <Route path="/loading" element={<Loading />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              
                
            </Routes>
          </FoodProvider>
        
      
      
      
    </>
  )
}

export default App
