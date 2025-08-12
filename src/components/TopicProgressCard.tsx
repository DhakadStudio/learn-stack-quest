import { Card, CardContent } from "@/components/ui/card";
import { ProgressRing } from "@/components/ProgressRing";
import { SelectionCard } from "@/components/SelectionCard";
import { cn } from "@/lib/utils";

interface TopicProgressCardProps {
  topicId: string;
  topicName: string;
  topicNumber: number;
  progress: number; // 0-100
  onClick: () => void;
  className?: string;
}

export const TopicProgressCard = ({ 
  topicId, 
  topicName, 
  topicNumber, 
  progress, 
  onClick, 
  className 
}: TopicProgressCardProps) => {
  return (
    <div className={cn("relative", className)}>
      <SelectionCard
        title={`${topicNumber}. ${topicName}`}
        onClick={onClick}
        className="h-16 pr-20"
      />
      
      {/* Progress Ring Overlay */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <ProgressRing 
          progress={progress} 
          size="sm" 
          showPercentage={progress > 0}
        />
      </div>
    </div>
  );
};