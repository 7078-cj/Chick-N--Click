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

function App() {
  

  
  
  return (
    <>
      
      <Router>
        <AuthProvider>
          <FoodProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
                
              <Route element={<PrivateRoutes allowedRoles={["user"]} />} >
                <Route path="/" element={<Home />} />
              </Route>

              <Route element={<PrivateRoutes allowedRoles={["admin"]} />} >
                <Route path="/admin" element={<Admin />} />
              </Route>

              <Route path="/unauthorized" element={<Unauthorized />} />

              
                
            </Routes>
          </FoodProvider>
        </AuthProvider>
      </Router>
      
      
    </>
  )
}

export default App
