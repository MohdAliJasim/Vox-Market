"use client";
import { AppProvider } from "@/context/AppContext";
import { SpeechProvider } from "@/context/SpeechContext";
import {CartProvider} from "@/context/CartContext";
import React from "react";
import SpeechTranscript from '@/app/components/speechTranscript';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SpeechRecognition from "./components/SpeechButton";

const Template = ({ children }) => {
 return <AppProvider> 
     {/* <Router> */}
      <SpeechProvider>
        <CartProvider>
          {children}<SpeechRecognition/><SpeechTranscript />
        </CartProvider>
       </SpeechProvider>
    {/* </Router> */}
</AppProvider>;
};

export default Template;
