"use client";
import { AppProvider } from "@/context/AppContext";
import { SpeechProvider } from "../context/SpeechContext";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SpeechRecognition from "./components/SpeechButton";

const Template = ({ children }) => {
  return <AppProvider> 
     <Router><SpeechProvider>{children}<SpeechRecognition/></SpeechProvider></Router></AppProvider>;
};

export default Template;
