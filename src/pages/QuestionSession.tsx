import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QuestionCard } from "@/components/QuestionCard";
import { AdCard } from "@/components/AdCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { questions } from "@/data/mockData";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const QuestionSession = () => {
  const { classId, subjectId, chapterId, topicId } = useParams<{ 
    classId: string; 
    subjectId: string; 
    chapterId: string; 
    topicId: string; 
  }>();
  const navigate = useNavigate();

  const [bookmarkedQuestions, setBookmarkedQuestions] = useLocalStorage<string[]>("bookmarked_questions", []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAd, setShowAd] = useState(false);

  const topicQuestions = questions[topicId || ""] || [];

  useEffect(() => {
    // Show ad after every 3 questions
    if (currentQuestionIndex > 0 && currentQuestionIndex % 3 === 0) {
      setShowAd(true);
    }
  }, [currentQuestionIndex]);

  const handleNext = () => {
    if (showAd) {
      setShowAd(false);
      return;
    }

    if (currentQuestionIndex < topicQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // End of questions - navigate back to topic selection
      navigate(`/topics/${classId}/${subjectId}/${chapterId}`);
    }
  };

  const handleBookmark = (questionId: string) => {
    setBookmarkedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  if (topicQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No questions available for this topic</p>
          <Button
            variant="outline"
            onClick={() => navigate(`/topics/${classId}/${subjectId}/${chapterId}`)}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = topicQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/topics/${classId}/${subjectId}/${chapterId}`)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {topicQuestions.length}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <Home className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        {showAd ? (
          <AdCard onNext={handleNext} />
        ) : (
          <QuestionCard
            question={currentQuestion}
            onNext={handleNext}
            onBookmark={handleBookmark}
            isBookmarked={bookmarkedQuestions.includes(currentQuestion.id)}
          />
        )}
      </div>
    </div>
  );
};

export default QuestionSession;