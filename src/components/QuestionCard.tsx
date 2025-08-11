import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Bookmark, BookmarkCheck, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
  answer: string;
  chapter: string;
  topic: string;
}

interface QuestionCardProps {
  question: Question;
  onNext: () => void;
  onBookmark: (questionId: string) => void;
  isBookmarked: boolean;
}

export const QuestionCard = ({ 
  question, 
  onNext, 
  onBookmark,
  isBookmarked 
}: QuestionCardProps) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
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
        
        <div className="text-xs text-muted-foreground mb-2">
          {question.chapter} • {question.topic}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground leading-relaxed">
            {question.text}
          </h2>
          
          {showAnswer && (
            <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20 animate-fade-in">
              <h3 className="text-sm font-medium text-secondary mb-2 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Answer
              </h3>
              <p className="text-foreground leading-relaxed">
                {question.answer}
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
            <Button
              variant="success"
              size="wide"
              onClick={onNext}
              className="w-full"
            >
              Next Question
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};