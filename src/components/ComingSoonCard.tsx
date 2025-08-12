import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft } from "lucide-react";

interface ComingSoonCardProps {
  topicName: string;
  onGoBack: () => void;
}

export const ComingSoonCard = ({ topicName, onGoBack }: ComingSoonCardProps) => {
  return (
    <div className="min-h-screen bg-background px-4 py-8 flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
        <CardContent className="text-center py-12 space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">Coming Soon</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions for <span className="font-semibold text-foreground">{topicName}</span> are being prepared and will be available soon.
            </p>
          </div>
          
          <div className="pt-4">
            <Button
              variant="outline"
              onClick={onGoBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};