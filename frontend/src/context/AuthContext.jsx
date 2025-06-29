import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext({
    user : null,
    setUser : () => {}
})

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/agent/current-user`, {
                withCredentials: true
            });
            console.log("res : ", res);
            if(res.data.success){
                setUser(res.data.user);
            }
        }

        fetchLoggedInUser().catch(err => {
            console.error("Error fetching logged in user: ", err);
        });
    },[])

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
