// SpeechTranscript.jsx
'use client'
import { useContext } from 'react';
import { SpeechContext } from '@/context/SpeechContext';

export default function SpeechTranscript() {
  const { liveTranscript, listening } = useContext(SpeechContext);

  if (!listening) return null;

  return (
    <div className="fixed bottom-24 right-4 bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-xs md:max-w-md z-50">
      <div className="flex items-center mb-2">
        <div className="flex space-x-1 mr-2">
          <span className="animate-pulse inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
          <span className="animate-pulse inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75" style={{ animationDelay: '150ms' }}></span>
          <span className="animate-pulse inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75" style={{ animationDelay: '300ms' }}></span>
        </div>
        <span className="text-sm font-medium">Listening...</span>
      </div>
      <p className="text-white">{liveTranscript}</p>
    </div>
  );
}