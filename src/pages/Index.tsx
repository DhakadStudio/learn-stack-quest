import { useNavigate } from "react-router-dom";
import { SelectionCard } from "@/components/SelectionCard";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BookMarked, GraduationCap, BookOpen } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="min-h-screen bg-background/95 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center shadow-elevated">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                LearnHub
              </h1>
              <p className="text-muted-foreground">Choose your class to begin learning</p>
            </div>
            <div className="flex justify-end">
              <ThemeToggle />
            </div>
          </div>

          {/* Class Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Select Your Class</h2>
            <div className="grid gap-4">
              <SelectionCard
                title="Class 10 - CBSE"
                description="Foundation subjects with comprehensive coverage"
                icon={<BookOpen className="w-8 h-8" />}
                onClick={() => navigate("/subjects/10")}
                className="h-24"
              />
              <SelectionCard
                title="Class 12 - CBSE"
                description="Advanced subjects for competitive preparation"
                icon={<GraduationCap className="w-8 h-8" />}
                onClick={() => navigate("/subjects/12")}
                className="h-24"
              />
            </div>
          </div>

          {/* Quick Access */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Quick Access
            </h3>
            <Button
              variant="outline"
              size="wide"
              onClick={() => navigate("/bookmarks")}
              className="w-full justify-start"
            >
              <BookMarked className="w-5 h-5 mr-3" />
              My Bookmarked Questions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;