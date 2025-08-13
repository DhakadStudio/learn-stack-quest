import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookmarkCheck, Play, Target } from "lucide-react";
import { Question, concepts } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface QuestionListItemProps {
  question: Question;
  isCompleted: boolean;
  isBookmarked: boolean;
  onClick: () => void;
}

/**
 * Question List Item Component
 * 
 * Displays individual question in the question selection list
 * Shows difficulty, concepts, completion status, and time estimate
 */
export const QuestionListItem = ({ 
  question, 
  isCompleted, 
  isBookmarked, 
  onClick 
}: QuestionListItemProps) => {
  // Get difficulty color for badge styling
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "simple": return "bg-secondary text-secondary-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "hard": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // Get concept names from concept IDs
  const conceptNames = question.concepts.map(conceptId => 
    concepts[conceptId]?.name || conceptId
  );

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-card hover-scale",
        "bg-gradient-card border border-border/50",
        isCompleted && "bg-secondary/5 border-secondary/20"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header with status indicators */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {/* Completion status indicator */}
            {isCompleted && (
              <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
            )}
            {/* Bookmark indicator */}
            {isBookmarked && (
              <BookmarkCheck className="w-4 h-4 text-accent" />
            )}
          </div>
          
          {/* Difficulty badge */}
          <Badge 
            variant="secondary" 
            className={cn("text-xs", getDifficultyColor(question.difficulty))}
          >
            {question.difficulty.toUpperCase()}
          </Badge>
        </div>

        {/* Question text preview */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground line-clamp-2 leading-relaxed">
            {question.text}
          </p>
        </div>

        {/* Concepts used */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1">
            <Target className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {question.isMultiConcept ? "Multi-concept" : "Single concept"}
            </span>
          </div>
          
          {/* Concept tags */}
          <div className="flex flex-wrap gap-1">
            {conceptNames.slice(0, 2).map((concept, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs bg-primary/5 border-primary/20 text-primary"
              >
                {concept}
              </Badge>
            ))}
            {conceptNames.length > 2 && (
              <Badge variant="outline" className="text-xs bg-muted/50">
                +{conceptNames.length - 2} more
              </Badge>
            )}
          </div>
        </div>

        {/* Footer with time estimate and action button */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className="text-xs">{question.estimatedTime} min</span>
          </div>
          
          <Button 
            size="sm" 
            variant={isCompleted ? "secondary" : "default"}
            className="h-6 px-3 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Play className="w-3 h-3 mr-1" />
            {isCompleted ? "Review" : "Start"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};