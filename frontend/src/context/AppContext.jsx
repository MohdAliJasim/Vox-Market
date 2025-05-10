"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const router = useRouter();
  const [auth, setAuth] = useState({
    user: null,
    seller: null,
    userToken: null,
    sellerToken: null
  });

  // Add this function to sync with localStorage
  const syncAuthState = () => {
    // Handle both cases for backward compatibility
    const userToken = localStorage.getItem("userToken") || localStorage.getItem("Usertoken");
    const sellerToken = localStorage.getItem("sellerToken") || localStorage.getItem("Sellertoken");
    const userData = localStorage.getItem("userData") || localStorage.getItem("user");
    const sellerData = localStorage.getItem("sellerData") || localStorage.getItem("Seller");
  
    setAuth({
      user: userData ? JSON.parse(userData) : null,
      seller: sellerData ? JSON.parse(sellerData) : null,
      userToken,
      sellerToken
    });
  };

  // Initialize auth state
  useEffect(() => {
    syncAuthState();
    
    // Optional: Listen for storage events from other tabs
    const handleStorageChange = () => syncAuthState();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Updated login functions
  const userLogin = (token, userData) => {
    localStorage.setItem("userToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    syncAuthState(); // Force state update
  };

  const sellerLogin = (token, sellerData) => {
    // Use consistent keys going forward
    localStorage.setItem("sellerToken", token);
    localStorage.setItem("sellerData", JSON.stringify(sellerData));
    syncAuthState(); // Use syncAuthState instead of direct setAuth
  };

  // Logout handlers
  const userLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    setAuth(prev => ({
      ...prev,
      user: null,
      userToken: null
    }));
    router.push("/login");
  };

  const sellerLogout = () => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerData");
    setAuth(prev => ({
      ...prev,
      seller: null,
      sellerToken: null
    }));
    router.push("/seller-login");
  };

  // Combined logout
  const logout = () => {
    if (auth.userToken) userLogout();
    if (auth.sellerToken) sellerLogout();
  };

  return (
    <AppContext.Provider
      value={{
        ...auth,
        userLogin,
        sellerLogin,
        userLogout,
        sellerLogout,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export default useAppContext;