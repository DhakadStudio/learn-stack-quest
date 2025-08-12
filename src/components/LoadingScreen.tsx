import { useEffect, useState } from "react";
import appIcon from "@/assets/app-icon.png";

interface LoadingScreenProps {
  onComplete: () => void;
}

const loadingTexts = [
  "Initializing Question Bank...",
  "Loading Subjects...",
  "Preparing Chapters...",
  "Setting up Topics...",
  "Connecting to Database...",
  "Finalizing Setup...",
];

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState(loadingTexts[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        
        // Update text based on progress
        const textIndex = Math.floor((newProgress / 100) * loadingTexts.length);
        if (textIndex < loadingTexts.length) {
          setCurrentText(loadingTexts[textIndex]);
        }
        
        return newProgress;
      });
    }, 50);

    const timeout = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center z-50">
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {/* App Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl animate-pulse">
            <img 
              src={appIcon} 
              alt="Question Bank App" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Brand Section */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground">
            ? Bank
          </h1>
          <p className="text-muted-foreground text-lg">
            Your Ultimate Question Practice Platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Offline Access</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span>Progress Tracking</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>Smart Practice</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary/70 rounded-full"></div>
            <span>Performance Analytics</span>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "1s" }}>
          <div className="bg-background/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{currentText}</p>
            <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};