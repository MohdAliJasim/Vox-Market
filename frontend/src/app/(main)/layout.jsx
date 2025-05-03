import React from "react";
import Footer from "../components/navigation/Footer";





const Layout = ({ children }) => {
  return (
    <>
      
      {children}
      <Footer/>   
   
    </>
  );
};

export default Layout;
