import { useNavigate } from "react-router-dom";
import { SelectionCard } from "@/components/SelectionCard";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { PerformanceButton } from "@/components/PerformanceButton";
import { StreakDisplay } from "@/components/StreakDisplay";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { BookMarked, GraduationCap, BookOpen, Bell } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import questionBankLogo from "@/assets/question-bank-logo.png";

const Index = () => {
  const navigate = useNavigate();
  const { permissionStatus, requestPermission, isSupported } = usePushNotifications();

  useEffect(() => {
    // Request notification permission on first visit
    if (isSupported && permissionStatus === 'prompt') {
      setTimeout(() => {
        toast('Enable notifications to track your learning streak!', {
          action: {
            label: 'Enable',
            onClick: () => requestPermission()
          }
        });
      }, 2000);
    }
  }, [isSupported, permissionStatus, requestPermission]);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="min-h-screen bg-background/95 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-elevated overflow-hidden">
              <img src={questionBankLogo} alt="? Bank Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ? Bank
              </h1>
              <p className="text-muted-foreground">Choose your class to begin learning</p>
            </div>
            <div className="flex justify-between items-center">
              <PerformanceButton />
              <div className="flex gap-2">
                {permissionStatus !== 'granted' && isSupported && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={requestPermission}
                    className="text-muted-foreground"
                  >
                    <Bell className="w-4 h-4" />
                  </Button>
                )}
                <ThemeToggle />
                <UserMenu />
              </div>
            </div>
          </div>

          {/* Streak Display */}
          <StreakDisplay />

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