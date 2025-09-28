import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();


export default AuthContext


export function AuthProvider({children}) {
    const [token, setToken] = useState(
        JSON.parse(localStorage.getItem('token')) || null
    );

    const [user, setUser] = useState(
         JSON.parse(localStorage.getItem('user')) || null
    );
   

    const nav = useNavigate()

    const url = import.meta.env.VITE_API_URL

   const loginUser = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(url + '/api/login', {   // Laravel login route
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: e.target.email.value,
                    password: e.target.password.value,
                }),
            });

            if (response.ok) {
                const data = await response.json();
               
               
                await setToken(data.token);
                await setUser(data.user);
                

                localStorage.setItem('token', JSON.stringify(data.token));
                localStorage.setItem('user', JSON.stringify(data.user));
                
                if (data.user.role == "admin"){
                    nav('/admin')
                }else{
                    nav('/home')
                }
                
            } else {
                console.error("Login failed");
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };
    
    const logoutUser = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
       
    }

    var context = {
        loginUser:loginUser,
        logOut:logoutUser,
        user:user,
        token:token,
        setUser:setUser
    }
    return (
      <AuthContext.Provider value={context}>
        {children}
      </AuthContext.Provider>
    )
  }