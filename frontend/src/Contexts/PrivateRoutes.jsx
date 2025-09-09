import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from './AuthContext'

function PrivateRoutes({children,...rest}) {
    
    let {user} = useContext(AuthContext)

  
    return user ? <Outlet /> : <Navigate to="/login" />;
  
}

export default PrivateRoutes