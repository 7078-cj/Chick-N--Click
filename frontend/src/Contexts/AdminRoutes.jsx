import { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";

function AdminRoutes() {
    const { user, setUser, token } = useContext(AuthContext);
    const nav = useNavigate()
    const url = import.meta.env.VITE_API_URL

    const getUserDetails = async () => {
        if (token) {
            
            try {
            const result = await fetch(url + "/api/user", {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
            });

            if (result.ok) {
                const data = await result.json();
                setUser(data);
                
            } else {
                console.error("user fetch failed");
                setUser(null);
                

               
                if (!["/login", "/register"].includes(window.location.pathname)) {
                nav("/login");
                }
            }
            } catch (err) {
            console.error("Error fetching user", err);
            setUser(null);
            

            if (!["/login", "/register"].includes(window.location.pathname)) {
                nav("/login");
            }
            }
        } else {
            setUser(null);
           
            if (!["/login", "/register"].includes(window.location.pathname)) {
            nav("/login");
            }
        }
        };

    useEffect(()=>{
        getUserDetails()
    },[])
  

  return user.role == "admin" ? <Outlet/> : <Navigate to="/unauthorized" replace />

 
}

export default AdminRoutes;
