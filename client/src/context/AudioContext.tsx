import React, { createContext, useContext, useState } from "react";

interface AudioContextType {
  currentUtterance: SpeechSynthesisUtterance | null;
  playAudio: (text: string) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUtterance, setCurrentUtterance] =
    useState<SpeechSynthesisUtterance | null>(null);

  const playAudio = (text: string) => {
    if (currentUtterance) {
      speechSynthesis.cancel(); // Stop any ongoing speech
    }

    const utterance = new SpeechSynthesisUtterance(text);
    setCurrentUtterance(utterance);
    speechSynthesis.speak(utterance);
  };

  const pauseAudio = () => {
    if (currentUtterance) {
      speechSynthesis.pause();
    }
  };

  const resumeAudio = () => {
    if (currentUtterance) {
      speechSynthesis.resume();
    }
  };

  const stopAudio = () => {
    if (currentUtterance) {
      speechSynthesis.cancel();
      setCurrentUtterance(null);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentUtterance,
        playAudio,
        pauseAudio,
        resumeAudio,
        stopAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
