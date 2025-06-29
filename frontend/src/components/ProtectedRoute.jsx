import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({children}) {
    const {user, setUser} = useAuth();

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/agent/current-user`);
            console.log("res : ", res);
            // return res;
        }

        fetchLoggedInUser();
    }, [])

  if(user) return {children}
  else return <Navigate to={"/login"} />
}

export default ProtectedRoute