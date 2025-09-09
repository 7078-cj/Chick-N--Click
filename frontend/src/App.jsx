import { useEffect, useState } from 'react'
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

function App() {
  
  
  return (
    <>
      
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
              
            <Route element={<PrivateRoutes />} >
              <Route path="/" element={<Home />} />
            </Route>
              
          </Routes>
        </AuthProvider>
      </Router>
      
      
    </>
  )
}

export default App
