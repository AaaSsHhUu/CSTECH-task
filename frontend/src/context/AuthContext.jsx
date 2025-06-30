import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext({
    user : null,
    setUser : () => {},
    loading : true
})

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/agent/current-user`, {
                    withCredentials: true
                });
                console.log("res : ", res);
                if(res.data.success){
                    setUser(res.data.user);
                    setLoading(false);
                }
            } catch (error) {
                setUser(null);
            }
            finally{
                setLoading(false);
            }
        }

        fetchLoggedInUser();
    },[])

    return (
        <AuthContext.Provider value={{user, setUser, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);
