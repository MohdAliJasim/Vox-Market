'use client'

import { useState, useContext } from 'react'
import  Button  from "@/app/ui/Button"
import { Mic, MicOff } from 'lucide-react'
import { SpeechContext } from '@/context/SpeechContext'

export default function SpeechRecognition() {
  const [isListening, setIsListening] = useState(false)
  const [isCentered, setIsCentered] = useState(false)
  const { startListening, stopListening } = useContext(SpeechContext)

  const handleToggleListening = () => {
    if (isListening) {
      stopListening()
      setIsListening(false)
      setIsCentered(false)
    } else {
      startListening()
      setIsListening(true)
      setIsCentered(true)
    }
  }

  return (
    <div className={`fixed transition-all duration-300 ${
      isCentered ? 'inset-0 flex items-center justify-center bg-black bg-opacity-50' : 'bottom-4 right-4'
    }`}>
      <div className="relative">
        {isListening && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              <span className="animate-bounce inline-flex h-2 w-2 rounded-full bg-blue-500 opacity-75" style={{ animationDelay: '0ms' }}></span>
              <span className="animate-bounce inline-flex h-2 w-2 rounded-full bg-blue-500 opacity-75" style={{ animationDelay: '150ms' }}></span>
              <span className="animate-bounce inline-flex h-2 w-2 rounded-full bg-blue-500 opacity-75" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <Button
          onClick={handleToggleListening}
          className={`relative overflow-hidden rounded-full w-16 h-16 transition-all duration-300 ${
            isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
        >
          {isListening ? (
            <MicOff className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Mic className="h-6 w-6" aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  )
}