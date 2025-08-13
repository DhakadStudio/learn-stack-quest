import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionCard } from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { questions } from "@/data/mockData";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const BookmarkedQuestions = () => {
  const navigate = useNavigate();
  const [bookmarkedQuestions, setBookmarkedQuestions] = useLocalStorage<string[]>("bookmarked_questions", []);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get all bookmarked questions from all topics
  const bookmarkedQuestionData = bookmarkedQuestions.map(id => {
    // Find the question in all topics
    for (const topicQuestions of Object.values(questions)) {
      const question = topicQuestions.find(q => q.id === id);
      if (question) return question;
    }
    return null;
  }).filter(Boolean);

  const handleNext = () => {
    if (currentIndex < bookmarkedQuestionData.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // Loop back to first
    }
  };

  const handleBookmark = (questionId: string) => {
    setBookmarkedQuestions(prev => prev.filter(id => id !== questionId));
    
    // Adjust current index if we removed the current question
    if (currentIndex >= bookmarkedQuestionData.length - 1) {
      setCurrentIndex(Math.max(0, bookmarkedQuestionData.length - 2));
    }
  };

  if (bookmarkedQuestionData.length === 0) {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4 animate-fade-in">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Bookmarked Questions</h1>
              <p className="text-muted-foreground">Your saved questions</p>
            </div>
          </div>

          {/* Empty State */}
          <div className="text-center py-12 space-y-4 animate-fade-in">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No bookmarks yet</h3>
              <p className="text-muted-foreground mb-6">
                Start practicing questions and bookmark them for offline study
              </p>
              <Button
                variant="gradient"
                onClick={() => navigate("/")}
              >
                Start Learning
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = bookmarkedQuestionData[currentIndex];

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-lg font-bold text-foreground">Bookmarks</h1>
            <p className="text-sm text-muted-foreground">
              {currentIndex + 1} of {bookmarkedQuestionData.length}
            </p>
          </div>

          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Question */}
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            onNext={handleNext}
            onBookmark={handleBookmark}
            isBookmarked={true}
          />
        )}
      </div>
    </div>
  );
};

export default BookmarkedQuestions;