import { useNavigate } from "react-router-dom";
import { SelectionCard } from "@/components/SelectionCard";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GraduationCap, BookOpen } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto space-y-8">
        {/* Header with Theme Toggle */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-elevated">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">LearnHub</h1>
            <p className="text-muted-foreground">Choose your class to start learning</p>
          </div>
        </div>

        {/* Class Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground text-center mb-6">
            Select Your Class
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            <SelectionCard
              title="Class 10"
              description="CBSE Board • Foundation Level"
              icon={<span className="text-2xl">🎓</span>}
              onClick={() => navigate("/subjects/10")}
            />
            
            <SelectionCard
              title="Class 12"
              description="CBSE Board • Advanced Level"
              icon={<span className="text-2xl">📘</span>}
              onClick={() => navigate("/subjects/12")}
            />
          </div>
        </div>

        {/* Quick Access */}
        <div className="pt-6 border-t border-border">
          <Button
            variant="outline"
            size="wide"
            onClick={() => navigate("/bookmarks")}
            className="w-full"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            My Bookmarked Questions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;