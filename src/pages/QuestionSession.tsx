import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { QuestionCard } from "@/components/QuestionCard";
import { AdCard } from "@/components/AdCard";
import { GoogleAdPlaceholder } from "@/components/GoogleAdPlaceholder";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, Home, ChevronLeft, ChevronRight } from "lucide-react";
import { questions } from "@/data/mockData";
import { useLocalStorage } from "@/hooks/useLocalStorage";

/**
 * Question Session Component
 * 
 * Enhanced question solving interface with:
 * - Swipe navigation between questions
 * - Touch gesture support for mobile devices
 * - Google Ads integration placeholders
 * - Dark/light theme support
 * - Progress tracking and completion status
 * - Bookmark functionality with local storage
 */
const QuestionSession = () => {
  const { classId, subjectId, chapterId, topicId } = useParams<{ 
    classId: string; 
    subjectId: string; 
    chapterId: string; 
    topicId: string; 
  }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Local storage for user data
  const [bookmarkedQuestions, setBookmarkedQuestions] = useLocalStorage<string[]>("bookmarked_questions", []);
  const [completedQuestions, setCompletedQuestions] = useLocalStorage<string[]>("completed_questions", []);
  
  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAd, setShowAd] = useState(false);
  const [showGoogleAd, setShowGoogleAd] = useState(false);
  
  // Touch/swipe handling refs
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const topicQuestions = questions[topicId || ""] || [];
  
  // Check if starting from a specific question
  const startQuestionId = searchParams.get("start");
  
  // Initialize question index based on URL parameter
  useEffect(() => {
    if (startQuestionId) {
      const questionIndex = topicQuestions.findIndex(q => q.id === startQuestionId);
      if (questionIndex !== -1) {
        setCurrentQuestionIndex(questionIndex);
      }
    }
  }, [startQuestionId, topicQuestions]);

  // Ad display logic - show ads after every 3 questions
  useEffect(() => {
    if (currentQuestionIndex > 0 && currentQuestionIndex % 3 === 0) {
      setShowAd(true);
    }
    // Show Google Ad after every 5 questions
    if (currentQuestionIndex > 0 && currentQuestionIndex % 5 === 0) {
      setShowGoogleAd(true);
    }
  }, [currentQuestionIndex]);

  // Touch event handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const swipeDistance = touchStartX.current - touchEndX.current;
    
    // Right swipe (previous question)
    if (swipeDistance < -swipeThreshold && currentQuestionIndex > 0) {
      handlePrevious();
    }
    // Left swipe (next question)
    else if (swipeDistance > swipeThreshold) {
      handleNext();
    }
  };

  // Navigation handlers
  const handleNext = () => {
    // Handle ad dismissal first
    if (showAd) {
      setShowAd(false);
      return;
    }
    if (showGoogleAd) {
      setShowGoogleAd(false);
      return;
    }

    // Mark current question as completed when moving to next
    const currentQuestion = topicQuestions[currentQuestionIndex];
    if (currentQuestion && !completedQuestions.includes(currentQuestion.id)) {
      setCompletedQuestions(prev => [...prev, currentQuestion.id]);
    }

    if (currentQuestionIndex < topicQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // End of questions - navigate back to question selection
      navigate(`/question-list/${classId}/${subjectId}/${chapterId}/${topicId}`);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Bookmark handling
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
            onClick={() => navigate(`/question-list/${classId}/${subjectId}/${chapterId}/${topicId}`)}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = topicQuestions[currentQuestionIndex];

  return (
    <div 
      className="min-h-screen bg-background px-4 py-6"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-md mx-auto space-y-6">
        {/* Enhanced Header with Theme Toggle and Navigation */}
        <div className="flex items-center justify-between animate-fade-in">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/question-list/${classId}/${subjectId}/${chapterId}/${topicId}`)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="text-center flex-1 mx-4">
            <p className="text-sm font-semibold text-foreground">
              Question {currentQuestionIndex + 1} of {topicQuestions.length}
            </p>
            <div className="w-full bg-border rounded-full h-1.5 mt-1">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((currentQuestionIndex + 1) / topicQuestions.length) * 100}%` 
                }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <Home className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Google Ad Placeholder */}
        {showGoogleAd && (
          <div className="animate-fade-in">
            <GoogleAdPlaceholder 
              size="banner" 
              onClose={() => setShowGoogleAd(false)}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="relative">
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

        {/* Navigation Controls for Desktop/Tablet */}
        <div className="flex justify-between items-center animate-fade-in">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="text-xs text-muted-foreground text-center">
            Swipe left/right to navigate
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentQuestionIndex === topicQuestions.length - 1 && !showAd && !showGoogleAd}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Bottom Google Ad Placeholder */}
        <div className="animate-fade-in">
          <GoogleAdPlaceholder size="large" />
        </div>
      </div>
    </div>
  );
};

export default QuestionSession;