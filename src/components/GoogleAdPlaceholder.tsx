import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, PlayCircle } from "lucide-react";

interface GoogleAdPlaceholderProps {
  size?: "banner" | "large" | "medium";
  onClose?: () => void;
}

/**
 * Google Ads Placeholder Component
 * 
 * Placeholder for Google AdMob integration
 * Displays where actual ads will be placed in production
 * Different sizes available for different ad placement strategies
 */
export const GoogleAdPlaceholder = ({ 
  size = "medium", 
  onClose 
}: GoogleAdPlaceholderProps) => {
  // Get dimensions based on ad size
  const getDimensions = () => {
    switch (size) {
      case "banner": return "h-16";
      case "large": return "h-32";
      case "medium": return "h-24";
      default: return "h-24";
    }
  };

  const getContent = () => {
    switch (size) {
      case "banner":
        return {
          title: "Banner Ad",
          description: "320x50 Google AdMob Banner"
        };
      case "large":
        return {
          title: "Large Banner Ad",
          description: "320x100 Google AdMob Large Banner"
        };
      default:
        return {
          title: "Medium Rectangle Ad",
          description: "300x250 Google AdMob Rectangle"
        };
    }
  };

  const content = getContent();

  return (
    <Card className={`w-full ${getDimensions()} bg-gradient-accent border-accent/30 relative`}>
      <CardContent className="p-3 h-full flex items-center justify-center">
        <div className="text-center text-accent-foreground">
          <PlayCircle className="w-6 h-6 mx-auto mb-1" />
          <h3 className="text-sm font-semibold">{content.title}</h3>
          <p className="text-xs opacity-80">{content.description}</p>
        </div>
        
        {/* Close button for interstitial-style ads */}
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-1 right-1 h-6 w-6 p-0 text-accent-foreground/80 hover:text-accent-foreground"
          >
            ×
          </Button>
        )}
        
        {/* Ad network identifier */}
        <div className="absolute bottom-1 right-2 text-xs text-accent-foreground/60">
          Google AdMob
        </div>
      </CardContent>
    </Card>
  );
};