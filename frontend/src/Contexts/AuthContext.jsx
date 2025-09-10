import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();


export default AuthContext


export function AuthProvider({children}) {
    const [token, setToken] = useState(
        JSON.parse(localStorage.getItem('token')) || null
    );

    const [user, setUser] = useState();

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

                // Save token & user properly
                setToken(data.token);
                setUser(data.user);

                localStorage.setItem('token', JSON.stringify(data.token));
               
                if (user.role == "admin"){
                    nav('/admin')
                }else{
                    nav('/')
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

    const getUserDetails =  async () => {
        if (token){
            const result = await fetch(url + '/api/user', {   
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
        
         if (result.ok) {
                const data = await result.json();
                setUser(data);
                if (data.role == "admin"){
                    nav('/admin')
                }else{
                    nav('/')
                }
            }
        
        else {
                console.error("user fetch failed");
            }
        }
        
    }


    useEffect(()=>{
        getUserDetails()
    },[])

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