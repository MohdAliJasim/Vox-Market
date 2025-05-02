// SpeechProvider.jsx
import "regenerator-runtime/runtime";
import React, { createContext, useState, useEffect, useCallback } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useRouter } from "next/navigation";

const SpeechContext = createContext();

const SpeechProvider = ({ children }) => {
  const [command, setCommand] = useState("");
  const [triggerLogin, setTriggerLogin] = useState(false);
  const router = useRouter();

  const commands = [
    {
      command: "*",
      callback: (transcript) => {
        if (transcript.toLowerCase().includes("home")) {
          console.log("home command detected");
          window.location.href = "/";
        }
        if (transcript.toLowerCase().includes("sign up")) {
          console.log("signup command detected");
          window.location.href = "/signup";
        }
        if (transcript.toLowerCase().includes("inventory")) {
          console.log("signup command detected");
          window.location.href = "/seller/manage-product";
        }
        if (transcript.toLowerCase().includes("seller login")) {
          console.log("seller login command detected");
          window.location.href = "/seller-login";
        }

        if (transcript.toLowerCase().includes("register")) {
          console.log("seller login command detected");
          window.location.href = "/seller-signup";
        }

        if (transcript.toLowerCase().includes("add product")) {
          console.log("seller login command detected");
          window.location.href = "/seller/add-product";
        }
        
        if (transcript.toLowerCase().includes("in")) {
          console.log("login command detected");
          setTriggerLogin(true); // Trigger login action in SellerLogin component
        }
        console.log(`${transcript}`);
      },
    },
  ];

  const { transcript, resetTranscript, listening } = useSpeechRecognition({
    commands,
  });

  useEffect(() => {
    if (transcript) {
      setCommand(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (listening) {
      SpeechRecognition.onend = () => {
        console.log("User stopped speaking, stopping microphone.");
        SpeechRecognition.stopListening();
      };
    }
  }, [listening]);

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  return (
    <SpeechContext.Provider value={{ command:"click *", startListening, stopListening, triggerLogin, setTriggerLogin }}>
      {children}
    </SpeechContext.Provider>
  );
};

export { SpeechContext, SpeechProvider };
