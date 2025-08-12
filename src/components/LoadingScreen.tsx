import { useEffect, useState } from "react";
import { BookOpen, Brain, Target, Zap } from "lucide-react";

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState(0);

  const loadingTexts = [
    "Preparing your learning environment...",
    "Loading educational content...",
    "Setting up your study session...",
    "Ready to learn!"
  ];

  const features = [
    { icon: BookOpen, text: "Comprehensive Study Material" },
    { icon: Brain, text: "Smart Learning System" },
    { icon: Target, text: "Focused Practice" },
    { icon: Zap, text: "Quick Results" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const textInterval = setInterval(() => {
      setCurrentText(prev => (prev + 1) % loadingTexts.length);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo/Brand */}
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-background/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">LearnHub</h1>
          <p className="text-white/80">Your Smart Learning Companion</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-background/10 backdrop-blur-sm rounded-lg p-4 text-white animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <feature.icon className="w-6 h-6 mx-auto mb-2" />
              <p className="text-xs font-medium">{feature.text}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="space-y-4">
          <div className="bg-background/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/90 text-sm animate-pulse">
            {loadingTexts[currentText]}
          </p>
          <p className="text-white/70 text-xs">{progress}%</p>
        </div>
      </div>
    </div>
  );
};