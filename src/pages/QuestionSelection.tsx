import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { QuestionFilters, QuestionFilters as Filters } from "@/components/QuestionFilters";
import { QuestionListItem } from "@/components/QuestionListItem";
import { YearFilter } from "@/components/YearFilter";
import { ProgressBar } from "@/components/ProgressBar";
import { ComingSoonCard } from "@/components/ComingSoonCard";
import { OfflinePrompt } from "@/components/OfflinePrompt";
import { ArrowLeft, Home, BookOpen, Shuffle } from "lucide-react";
import { useQuestions } from "@/services/dataService";
import { chapters, topics } from "@/data/mockData";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

/**
 * Question Selection Page
 * 
 * Displays a filtered list of questions for a specific topic
 * Features:
 * - Question filtering by status, difficulty, and concept complexity
 * - Question preview with difficulty, concepts, and time estimates
 * - Completion tracking
 * - Bookmark integration
 * - Random question selection
 */
const QuestionSelection = () => {
  const { classId, subjectId, chapterId, topicId } = useParams<{
    classId: string;
    subjectId: string;
    chapterId: string;
    topicId: string;
  }>();
  const navigate = useNavigate();

  const { isOnline } = useNetworkStatus();
  
  // Local storage for user progress and bookmarks
  const [completedQuestions, setCompletedQuestions] = useLocalStorage<string[]>("completed_questions", []);
  const [bookmarkedQuestions] = useLocalStorage<string[]>("bookmarked_questions", []);

  // Filter state
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    difficulty: "all",
    concepts: "all"
  });
  const [selectedYear, setSelectedYear] = useState<string>("all");

  // Get questions from service
  const { data: topicQuestions = [], loading, error } = useQuestions(topicId || "");
  const currentTopic = topics[chapterId || ""]?.find(t => t.id === topicId);
  const currentChapter = chapters[subjectId || ""]?.find(c => c.id === chapterId);

  // Get available years for filtering
  const availableYears = useMemo(() => {
    const years = topicQuestions
      .map(q => q.year)
      .filter((year): year is number => year !== undefined && year !== null);
    return Array.from(new Set(years)).sort((a, b) => b - a);
  }, [topicQuestions]);

  // Apply filters to questions
  const filteredQuestions = useMemo(() => {
    return topicQuestions.filter(question => {
      const isCompleted = completedQuestions.includes(question.id);
      
      // Status filter
      if (filters.status === "completed" && !isCompleted) return false;
      if (filters.status === "incomplete" && isCompleted) return false;
      
      // Difficulty filter
      if (filters.difficulty !== "all" && question.difficulty !== filters.difficulty) return false;
      
      // Year filter
      if (selectedYear !== "all" && question.year?.toString() !== selectedYear) return false;
      
      // Concept complexity filter (if field exists)
      const isMultiConcept = question.concepts && question.concepts.length > 1;
      if (filters.concepts === "single" && isMultiConcept) return false;
      if (filters.concepts === "multi" && !isMultiConcept) return false;
      
      return true;
    });
  }, [topicQuestions, filters, selectedYear, completedQuestions]);

  // Sort questions: incomplete first, then by difficulty
  const sortedQuestions = useMemo(() => {
    return [...filteredQuestions].sort((a, b) => {
      const aCompleted = completedQuestions.includes(a.id);
      const bCompleted = completedQuestions.includes(b.id);
      
      // Incomplete questions first
      if (aCompleted !== bCompleted) {
        return aCompleted ? 1 : -1;
      }
      
      // Then sort by year (newest first), then by difficulty
      if (a.year !== b.year) {
        return (b.year || 0) - (a.year || 0);
      }
      
      const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
      return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0) - 
             (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0);
    });
  }, [filteredQuestions, completedQuestions]);

  // Calculate question counts for filter badges
  const questionCounts = useMemo(() => {
    const total = topicQuestions.length;
    const completed = topicQuestions.filter(q => completedQuestions.includes(q.id)).length;
    const incomplete = total - completed;
    const easy = topicQuestions.filter(q => q.difficulty === "easy").length;
    const medium = topicQuestions.filter(q => q.difficulty === "medium").length;
    const hard = topicQuestions.filter(q => q.difficulty === "hard").length;
    const single = topicQuestions.filter(q => !q.concepts || q.concepts.length <= 1).length;
    const multi = topicQuestions.filter(q => q.concepts && q.concepts.length > 1).length;
    
    return { total, completed, incomplete, easy, medium, hard, single, multi };
  }, [topicQuestions, completedQuestions]);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (topicQuestions.length === 0) return 0;
    return Math.round((questionCounts.completed / questionCounts.total) * 100);
  }, [questionCounts, topicQuestions.length]);

  // Handle question selection
  const handleQuestionStart = (questionId: string) => {
    navigate(`/questions/${classId}/${subjectId}/${chapterId}/${topicId}?start=${questionId}`);
  };

  // Handle random question selection
  const handleRandomQuestion = () => {
    const incompleteQuestions = sortedQuestions.filter(q => !completedQuestions.includes(q.id));
    const questionsToChooseFrom = incompleteQuestions.length > 0 ? incompleteQuestions : sortedQuestions;
    
    if (questionsToChooseFrom.length > 0) {
      const randomQuestion = questionsToChooseFrom[Math.floor(Math.random() * questionsToChooseFrom.length)];
      handleQuestionStart(randomQuestion.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-pulse text-muted-foreground">Loading questions...</div>
        </div>
      </div>
    );
  }

  if (topicQuestions.length === 0) {
    return (
      <ComingSoonCard 
        topicName={currentTopic?.name || "this topic"}
        onGoBack={() => navigate(`/topics/${classId}/${subjectId}/${chapterId}`)}
      />
    );
  }

  return (
    <>
      <OfflinePrompt />
      <div className="min-h-screen bg-background px-4 py-6">
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
          
          <div className="text-center flex-1 mx-4">
            <h1 className="text-lg font-bold text-foreground">{currentTopic?.name}</h1>
            <p className="text-xs text-muted-foreground">{currentChapter?.name}</p>
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

        {/* Progress Bar */}
        <div className="animate-fade-in">
          <ProgressBar 
            progress={progressPercentage}
            variant={progressPercentage === 100 ? "success" : "default"}
            showPercentage={true}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in">
          <Button
            variant="gradient"
            size="wide"
            onClick={handleRandomQuestion}
            className="flex items-center justify-center space-x-2"
            disabled={sortedQuestions.length === 0}
          >
            <Shuffle className="w-4 h-4" />
            <span>Random Question</span>
          </Button>
          
          <Button
            variant="outline"
            size="wide"
            onClick={() => navigate("/bookmarks")}
            className="flex items-center justify-center space-x-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Bookmarks</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="animate-fade-in space-y-4">
          <QuestionFilters 
            filters={filters}
            onFiltersChange={setFilters}
            questionCounts={questionCounts}
          />
          
          {availableYears.length > 0 && (
            <YearFilter
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              availableYears={availableYears}
            />
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-3 animate-fade-in">
          {sortedQuestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No questions match your current filters</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  Questions ({sortedQuestions.length})
                </h2>
                <span className="text-xs text-muted-foreground">
                  {questionCounts.completed}/{questionCounts.total} completed
                </span>
              </div>
              
              {sortedQuestions.map((question, index) => (
                <QuestionListItem
                  key={question.id}
                  question={question}
                  isCompleted={completedQuestions.includes(question.id)}
                  isBookmarked={bookmarkedQuestions.includes(question.id)}
                  onClick={() => handleQuestionStart(question.id)}
                />
              ))}
            </>
          )}
        </div>
        </div>
      </div>
    </>
  );
};

export default QuestionSelection;