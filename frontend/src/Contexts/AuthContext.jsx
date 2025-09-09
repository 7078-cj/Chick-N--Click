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
            const response = await fetch(url + 'login', {   // Laravel login route
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

                // Save token & user properly
                setToken(data.token);
                setUser(data.user);

                localStorage.setItem('token', JSON.stringify(data.token));
                localStorage.setItem('user', JSON.stringify(data.user));

                nav('/');
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
        localStorage.removeItem('user');
    }


    

    var context = {
        loginUser:loginUser,
        logOut:logoutUser,
        user:user,
        token:token,
        



    }
    return (
      <AuthContext.Provider value={context}>
        {children}
      </AuthContext.Provider>
    )
  }