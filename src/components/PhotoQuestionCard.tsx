import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Bookmark, BookmarkCheck, Clock, Eye, Expand, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface PhotoQuestion {
  id: string;
  question_text: string;
  answer_text: string;
  image_url?: string;
  year?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface PhotoQuestionCardProps {
  question: PhotoQuestion;
  onNext: () => void;
  onBookmark: (questionId: string) => void;
  onMarkComplete: (questionId: string, isComplete: boolean) => void;
  isBookmarked: boolean;
  isCompleted: boolean;
}

export const PhotoQuestionCard = ({ 
  question, 
  onNext, 
  onBookmark,
  onMarkComplete,
  isBookmarked,
  isCompleted
}: PhotoQuestionCardProps) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    // Reset for new question
    setShowAnswer(false);
    setTimeElapsed(0);
    setIsRunning(true);
    setImageLoaded(false);
    setImageError(false);
  }, [question.id]);

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setIsRunning(false);
  };

  const handleBookmark = () => {
    onBookmark(question.id);
    toast({
      title: isBookmarked ? "Bookmark removed" : "Question bookmarked",
      description: isBookmarked 
        ? "Question removed from your bookmarks" 
        : "Question saved for offline viewing",
    });
  };

  const handleMarkComplete = (complete: boolean) => {
    onMarkComplete(question.id, complete);
    toast({
      title: complete ? "Marked as complete" : "Marked as incomplete",
      description: complete 
        ? "Question marked as completed" 
        : "Question marked as not done",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-question animate-slide-in bg-gradient-card">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-primary">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{formatTime(timeElapsed)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmark}
              className="text-primary hover:text-accent"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-5 h-5" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mb-2 flex items-center justify-between">
          <span>Photo Question</span>
          {question.year && <span>Year: {question.year}</span>}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground leading-relaxed">
            {question.question_text}
          </h2>
          
          {/* Image Section */}
          <div className="relative">
            {!imageError ? (
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative cursor-pointer group">
                    <img
                      src={question.image_url}
                      alt="Question image"
                      className={cn(
                        "w-full rounded-lg border border-border transition-opacity",
                        imageLoaded ? "opacity-100" : "opacity-0"
                      )}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageError(true)}
                    />
                    {!imageLoaded && !imageError && (
                      <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                        <div className="animate-pulse text-muted-foreground">Loading image...</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Expand className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                  <img
                    src={question.image_url}
                    alt="Question image - Full screen"
                    className="w-full h-auto max-h-[90vh] object-contain"
                  />
                </DialogContent>
              </Dialog>
            ) : (
              <div className="w-full h-48 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-center">
                <p className="text-destructive text-sm">Failed to load image</p>
              </div>
            )}
          </div>
          
          {showAnswer && (
            <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20 animate-fade-in">
              <h3 className="text-sm font-medium text-secondary mb-2 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Answer
              </h3>
              <p className="text-foreground leading-relaxed">
                {question.answer_text}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-3">
          {!showAnswer ? (
            <Button
              variant="gradient"
              size="wide"
              onClick={handleShowAnswer}
              className="w-full"
            >
              <Eye className="w-4 h-4 mr-2" />
              Show Answer
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Button
                  variant={isCompleted ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleMarkComplete(true)}
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Done
                </Button>
                <Button
                  variant={!isCompleted ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleMarkComplete(false)}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Not Done
                </Button>
              </div>
              <Button
                variant="success"
                size="wide"
                onClick={onNext}
                className="w-full"
              >
                Next Question
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};