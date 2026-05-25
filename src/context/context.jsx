import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // get logged-in user
  const getUser = async () => {
    try {
      const res = await api.get("/auth/getme");
      setUser(res.data.data);
    } catch (error) {
      setUser(null);
      console.log(error)
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  // login
  const login = async (credentials) => {
    const res = await api.post("/auth/signin", credentials);
    await getUser(); // 
    return res.data.data;
  };

  // logout
  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext not initialized");
  return context;
};