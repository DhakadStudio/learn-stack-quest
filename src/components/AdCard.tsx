import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Play } from "lucide-react";

interface AdCardProps {
  onNext: () => void;
}

export const AdCard = ({ onNext }: AdCardProps) => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-question animate-bounce-in bg-gradient-accent border-accent/30">
      <CardContent className="p-8 text-center space-y-6">
        <div className="text-accent-foreground">
          <Play className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Learning Partner</h2>
          <p className="text-sm opacity-90">
            Get personalized study plans and practice questions tailored to your learning pace
          </p>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            size="wide"
            className="w-full bg-accent-foreground/10 border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/20"
            onClick={() => {
              // Simulate ad click
              console.log("Ad clicked");
            }}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Learn More
          </Button>
          
          <Button
            variant="ghost"
            onClick={onNext}
            className="w-full text-accent-foreground/80 hover:text-accent-foreground hover:bg-accent-foreground/10"
          >
            Continue Learning
          </Button>
        </div>

        <div className="text-xs text-accent-foreground/70">
          Advertisement • Sponsored Content
        </div>
      </CardContent>
    </Card>
  );
};